# Appendix B: Vertex AI Feature Engineering Code

**Project:** KidsWear India - Cisco Webex Contact Center Deployment  
**Document Type:** Technical Appendix - AI/CCAI Implementation  
**Version:** 1.0  
**Date:** March 2026  
**Related Chapter:** Chapter 7, Section 7.4: Vertex AI Predictive Routing

---

## Purpose

This appendix provides production-ready Python code for implementing Vertex AI-based predictive routing in the KidsWear India contact center. The code covers feature engineering, model training, hyperparameter tuning, deployment, and real-time prediction integration with Webex Contact Center.

---

## 1. Environment Setup

### 1.1 Install Required Libraries

```bash
# requirements.txt
google-cloud-aiplatform==1.38.0
google-cloud-bigquery==3.13.0
google-cloud-storage==2.10.0
pandas==2.1.3
numpy==1.26.2
scikit-learn==1.3.2
xgboost==2.0.1
joblib==1.3.2
flask==3.0.0
gunicorn==21.2.0
prometheus-client==0.19.0
pyyaml==6.0.1
```

```bash
# Install dependencies
pip install -r requirements.txt
```

### 1.2 Configure GCP Authentication

```python
# config/gcp_setup.py
"""
GCP Authentication and Project Configuration
"""
import os
from google.cloud import aiplatform, bigquery, storage
from google.oauth2 import service_account

class GCPConfig:
    """Configuration for Google Cloud Platform services"""
    
    def __init__(self, project_id: str, region: str, credentials_path: str):
        self.project_id = project_id
        self.region = region
        self.credentials_path = credentials_path
        
# Load credentials
        self.credentials = service_account.Credentials.from_service_account_file(
            credentials_path,
            scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )
        
# Initialize clients
        self.init_clients()
    
    def init_clients(self):
        """Initialize GCP service clients"""
# Vertex AI
        aiplatform.init(
            project=self.project_id,
            location=self.region,
            credentials=self.credentials
        )
        
# BigQuery
        self.bq_client = bigquery.Client(
            project=self.project_id,
            credentials=self.credentials
        )
        
# Cloud Storage
        self.storage_client = storage.Client(
            project=self.project_id,
            credentials=self.credentials
        )
        
        print(f"✅ GCP clients initialized for project: {self.project_id}")
    
    def get_bigquery_client(self):
        """Return BigQuery client"""
        return self.bq_client
    
    def get_storage_client(self):
        """Return Cloud Storage client"""
        return self.storage_client

# Usage
if __name__ == "__main__":
    config = GCPConfig(
        project_id="kidswear-cc-ai-project",
        region="us-central1",
        credentials_path="/path/to/service-account-key.json"
    )
```

---

## 2. Data Collection & Preparation

### 2.1 Extract Historical Contact Data from BigQuery

```python
# data/data_extraction.py
"""
Extract historical contact center data for model training
"""
import pandas as pd
from google.cloud import bigquery
from datetime import datetime, timedelta
from typing import Optional

class ContactDataExtractor:
    """Extract and prepare contact center data from BigQuery"""
    
    def __init__(self, bq_client: bigquery.Client, project_id: str):
        self.bq_client = bq_client
        self.project_id = project_id
        self.dataset_id = "contact_center_data"
    
    def extract_historical_contacts(
        self,
        days_lookback: int = 90,
        min_duration: int = 30
    ) -> pd.DataFrame:
        """
        Extract historical contact data with outcomes
        
        Args:
            days_lookback: Number of days of historical data
            min_duration: Minimum call duration in seconds
        
        Returns:
            DataFrame with contact features and outcomes
        """
        query = f"""
        WITH contact_data AS (
            SELECT
                c.contact_id,
                c.customer_id,
                c.agent_id,
                c.queue_id,
                c.start_time,
                c.end_time,
                c.duration_seconds,
                c.wait_time_seconds,
                c.outcome,
                c.customer_satisfaction_score,
                c.first_call_resolution,
                c.transfer_count,
                c.disconnect_reason,
                
                -- Customer attributes
                cust.age_range,
                cust.loyalty_tier,
                cust.lifetime_value,
                cust.previous_contact_count,
                cust.avg_order_value,
                
                -- Agent attributes
                agent.skill_level,
                agent.tenure_days,
                agent.avg_handle_time,
                agent.avg_csat_score,
                agent.specializations,
                
                -- Temporal features
                EXTRACT(HOUR FROM c.start_time) AS hour_of_day,
                EXTRACT(DAYOFWEEK FROM c.start_time) AS day_of_week,
                DATE_DIFF(CURRENT_DATE(), DATE(c.start_time), DAY) AS days_since_contact,
                
                -- Contact context
                c.ivr_path,
                c.self_service_attempted,
                c.sentiment_score,
                c.call_reason_category
                
            FROM `{self.project_id}.{self.dataset_id}.contacts` c
            LEFT JOIN `{self.project_id}.{self.dataset_id}.customers` cust
                ON c.customer_id = cust.customer_id
            LEFT JOIN `{self.project_id}.{self.dataset_id}.agents` agent
                ON c.agent_id = agent.agent_id
            
            WHERE 
                c.start_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL {days_lookback} DAY)
                AND c.duration_seconds >= {min_duration}
                AND c.outcome IN ('resolved', 'escalated', 'abandoned')
        ),
        
        customer_history AS (
            SELECT
                cd.contact_id,
                COUNT(DISTINCT prev.contact_id) AS contacts_last_7days,
                COUNT(DISTINCT prev_30.contact_id) AS contacts_last_30days,
                AVG(prev.customer_satisfaction_score) AS avg_csat_30days
            FROM contact_data cd
            LEFT JOIN `{self.project_id}.{self.dataset_id}.contacts` prev
                ON cd.customer_id = prev.customer_id
                AND prev.start_time BETWEEN TIMESTAMP_SUB(cd.start_time, INTERVAL 7 DAY) AND cd.start_time
            LEFT JOIN `{self.project_id}.{self.dataset_id}.contacts` prev_30
                ON cd.customer_id = prev_30.customer_id
                AND prev_30.start_time BETWEEN TIMESTAMP_SUB(cd.start_time, INTERVAL 30 DAY) AND cd.start_time
            GROUP BY cd.contact_id
        )
        
        SELECT
            cd.*,
            ch.contacts_last_7days,
            ch.contacts_last_30days,
            ch.avg_csat_30days
        FROM contact_data cd
        LEFT JOIN customer_history ch ON cd.contact_id = ch.contact_id
        """
        
        print(f"🔍 Extracting data for last {days_lookback} days...")
        df = self.bq_client.query(query).to_dataframe()
        print(f"✅ Extracted {len(df):,} contacts")
        
        return df
    
    def create_target_variable(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Create binary target variable for model training
        
        Target: 1 if contact was successful (resolved + high CSAT), 0 otherwise
        """
        df = df.copy()
        
# Define success criteria
        df['is_successful'] = (
            (df['outcome'] == 'resolved') &
            (df['first_call_resolution'] == True) &
            (df['customer_satisfaction_score'] >= 4) &
            (df['transfer_count'] <= 1)
        ).astype(int)
        
        print(f"📊 Target distribution:")
        print(df['is_successful'].value_counts(normalize=True))
        
        return df
    
    def split_train_test(
        self,
        df: pd.DataFrame,
        test_size: float = 0.2,
        val_size: float = 0.1
    ) -> tuple:
        """
        Split data into train, validation, and test sets
        
        Uses temporal split to avoid data leakage
        """
# Sort by time
        df = df.sort_values('start_time')
        
        n = len(df)
        train_end = int(n * (1 - test_size - val_size))
        val_end = int(n * (1 - test_size))
        
        train_df = df.iloc[:train_end]
        val_df = df.iloc[train_end:val_end]
        test_df = df.iloc[val_end:]
        
        print(f"📊 Data split:")
        print(f"  Train: {len(train_df):,} ({len(train_df)/n*100:.1f}%)")
        print(f"  Val:   {len(val_df):,} ({len(val_df)/n*100:.1f}%)")
        print(f"  Test:  {len(test_df):,} ({len(test_df)/n*100:.1f}%)")
        
        return train_df, val_df, test_df

# Usage
if __name__ == "__main__":
    from config.gcp_setup import GCPConfig
    
    config = GCPConfig(
        project_id="kidswear-cc-ai-project",
        region="us-central1",
        credentials_path="/path/to/credentials.json"
    )
    
    extractor = ContactDataExtractor(
        bq_client=config.get_bigquery_client(),
        project_id=config.project_id
    )
    
# Extract data
    df = extractor.extract_historical_contacts(days_lookback=90)
    
# Create target
    df = extractor.create_target_variable(df)
    
# Split data
    train_df, val_df, test_df = extractor.split_train_test(df)
    
# Save to CSV
    train_df.to_csv('data/train.csv', index=False)
    val_df.to_csv('data/val.csv', index=False)
    test_df.to_csv('data/test.csv', index=False)
```

---

## 3. Feature Engineering Pipeline

### 3.1 Feature Engineering Class

```python
# features/feature_engineering.py
"""
Feature engineering pipeline for predictive routing model
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
from typing import List, Dict, Optional

class FeatureEngineer:
    """Transform raw contact data into ML-ready features"""
    
    def __init__(self):
        self.scalers = {}
        self.encoders = {}
        self.feature_names = []
    
    def engineer_features(self, df: pd.DataFrame, fit: bool = False) -> pd.DataFrame:
        """
        Apply all feature engineering transformations
        
        Args:
            df: Raw contact data
            fit: If True, fit transformers on this data
        
        Returns:
            Engineered features DataFrame
        """
        df = df.copy()
        
# 1. Temporal features
        df = self._create_temporal_features(df)
        
# 2. Customer features
        df = self._create_customer_features(df)
        
# 3. Agent features
        df = self._create_agent_features(df)
        
# 4. Contact context features
        df = self._create_context_features(df)
        
# 5. Interaction history features
        df = self._create_history_features(df)
        
# 6. Encode categorical variables
        df = self._encode_categoricals(df, fit=fit)
        
# 7. Scale numerical features
        df = self._scale_numerical(df, fit=fit)
        
# 8. Create interaction features
        df = self._create_interaction_features(df)
        
        return df
    
    def _create_temporal_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create time-based features"""
        df['hour_sin'] = np.sin(2 * np.pi * df['hour_of_day'] / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df['hour_of_day'] / 24)
        df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
        df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
        
# Business hours indicator
        df['is_business_hours'] = (
            (df['hour_of_day'] >= 9) & (df['hour_of_day'] <= 18)
        ).astype(int)
        
# Weekend indicator
        df['is_weekend'] = (df['day_of_week'].isin([1, 7])).astype(int)
        
# Peak hours indicator (11 AM - 2 PM, 5 PM - 7 PM)
        df['is_peak_hours'] = (
            ((df['hour_of_day'] >= 11) & (df['hour_of_day'] <= 14)) |
            ((df['hour_of_day'] >= 17) & (df['hour_of_day'] <= 19))
        ).astype(int)
        
        return df
    
    def _create_customer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create customer-specific features"""
# Loyalty tier encoding (Silver=1, Gold=2, Platinum=3)
        loyalty_map = {'Silver': 1, 'Gold': 2, 'Platinum': 3, None: 0}
        df['loyalty_tier_encoded'] = df['loyalty_tier'].map(loyalty_map).fillna(0)
        
# Customer value segments
        df['is_high_value'] = (df['lifetime_value'] > df['lifetime_value'].quantile(0.75)).astype(int)
        df['is_frequent_buyer'] = (df['previous_contact_count'] > 5).astype(int)
        
# Customer engagement score
        df['engagement_score'] = (
            df['previous_contact_count'].clip(0, 10) * 0.3 +
            df['loyalty_tier_encoded'] * 0.4 +
            (df['lifetime_value'] / df['lifetime_value'].max()) * 0.3
        )
        
# Recency (days since last contact)
        df['recency_score'] = 1 / (1 + df['days_since_contact'])
        
        return df
    
    def _create_agent_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create agent-specific features"""
# Agent performance score
        df['agent_performance_score'] = (
            (df['avg_csat_score'] / 5.0) * 0.5 +
            (1 - (df['avg_handle_time'] / df['avg_handle_time'].max())) * 0.3 +
            (df['skill_level'] / df['skill_level'].max()) * 0.2
        )
        
# Experience tiers
        df['agent_experience_tier'] = pd.cut(
            df['tenure_days'],
            bins=[0, 90, 365, 730, np.inf],
            labels=['novice', 'intermediate', 'experienced', 'expert']
        )
        
# Normalize AHT
        df['agent_aht_normalized'] = (
            df['avg_handle_time'] - df['avg_handle_time'].mean()
        ) / df['avg_handle_time'].std()
        
        return df
    
    def _create_context_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create contact context features"""
# Sentiment category
        df['sentiment_category'] = pd.cut(
            df['sentiment_score'],
            bins=[-1, -0.5, 0, 0.5, 1],
            labels=['very_negative', 'negative', 'neutral', 'positive']
        )
        
# Call reason priority
        priority_reasons = ['payment_issue', 'order_problem', 'complaint']
        df['is_priority_reason'] = df['call_reason_category'].isin(priority_reasons).astype(int)
        
# Self-service failure indicator
        df['self_service_failed'] = (
            (df['self_service_attempted'] == True) & 
            (df['ivr_path'].str.contains('agent_transfer', na=False))
        ).astype(int)
        
# Wait time category
        df['wait_time_category'] = pd.cut(
            df['wait_time_seconds'],
            bins=[0, 30, 60, 120, np.inf],
            labels=['quick', 'moderate', 'long', 'very_long']
        )
        
        return df
    
    def _create_history_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create interaction history features"""
# Contact frequency score
        df['contact_frequency_score'] = (
            df['contacts_last_7days'] * 0.6 +
            df['contacts_last_30days'] * 0.4
        )
        
# Customer satisfaction trend
        df['csat_trend'] = (
            df['avg_csat_30days'] - df['customer_satisfaction_score']
        ).fillna(0)
        
# Is repeat contact
        df['is_repeat_contact'] = (df['contacts_last_7days'] > 0).astype(int)
        
        return df
    
    def _encode_categoricals(self, df: pd.DataFrame, fit: bool) -> pd.DataFrame:
        """Encode categorical variables"""
        categorical_cols = [
            'age_range', 'call_reason_category', 'agent_experience_tier',
            'sentiment_category', 'wait_time_category'
        ]
        
        for col in categorical_cols:
            if col in df.columns:
                if fit:
                    self.encoders[col] = LabelEncoder()
                    df[f'{col}_encoded'] = self.encoders[col].fit_transform(
                        df[col].astype(str)
                    )
                else:
                    df[f'{col}_encoded'] = self.encoders[col].transform(
                        df[col].astype(str)
                    )
        
        return df
    
    def _scale_numerical(self, df: pd.DataFrame, fit: bool) -> pd.DataFrame:
        """Scale numerical features"""
        numerical_cols = [
            'duration_seconds', 'wait_time_seconds', 'lifetime_value',
            'avg_order_value', 'tenure_days', 'avg_handle_time',
            'contact_frequency_score', 'engagement_score'
        ]
        
        for col in numerical_cols:
            if col in df.columns:
                if fit:
                    self.scalers[col] = StandardScaler()
                    df[f'{col}_scaled'] = self.scalers[col].fit_transform(
                        df[[col]]
                    )
                else:
                    df[f'{col}_scaled'] = self.scalers[col].transform(
                        df[[col]]
                    )
        
        return df
    
    def _create_interaction_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create interaction/polynomial features"""
# Customer value × agent performance
        df['value_performance_interaction'] = (
            df['engagement_score'] * df['agent_performance_score']
        )
        
# Sentiment × wait time
        df['sentiment_wait_interaction'] = (
            df['sentiment_score'] * df['wait_time_seconds_scaled']
        )
        
# Contact frequency × loyalty tier
        df['frequency_loyalty_interaction'] = (
            df['contact_frequency_score'] * df['loyalty_tier_encoded']
        )
        
        return df
    
    def get_feature_columns(self) -> List[str]:
        """Return list of final feature column names"""
        return [
# Temporal
            'hour_sin', 'hour_cos', 'day_sin', 'day_cos',
            'is_business_hours', 'is_weekend', 'is_peak_hours',
            
# Customer
            'loyalty_tier_encoded', 'is_high_value', 'is_frequent_buyer',
            'engagement_score', 'recency_score',
            
# Agent
            'agent_performance_score', 'skill_level', 'agent_aht_normalized',
            
# Context
            'is_priority_reason', 'self_service_failed',
            'sentiment_score', 'transfer_count',
            
# History
            'contact_frequency_score', 'csat_trend', 'is_repeat_contact',
            
# Scaled numerical
            'duration_seconds_scaled', 'wait_time_seconds_scaled',
            'lifetime_value_scaled', 'avg_order_value_scaled',
            'tenure_days_scaled', 'avg_handle_time_scaled',
            
# Encoded categoricals
            'age_range_encoded', 'call_reason_category_encoded',
            'agent_experience_tier_encoded', 'sentiment_category_encoded',
            'wait_time_category_encoded',
            
# Interactions
            'value_performance_interaction',
            'sentiment_wait_interaction',
            'frequency_loyalty_interaction'
        ]
    
    def save_transformers(self, path: str):
        """Save fitted transformers"""
        joblib.dump({
            'scalers': self.scalers,
            'encoders': self.encoders,
            'feature_names': self.get_feature_columns()
        }, path)
        print(f"✅ Transformers saved to {path}")
    
    def load_transformers(self, path: str):
        """Load fitted transformers"""
        data = joblib.load(path)
        self.scalers = data['scalers']
        self.encoders = data['encoders']
        self.feature_names = data['feature_names']
        print(f"✅ Transformers loaded from {path}")

# Usage
if __name__ == "__main__":
# Load data
    train_df = pd.read_csv('data/train.csv')
    val_df = pd.read_csv('data/val.csv')
    test_df = pd.read_csv('data/test.csv')
    
# Initialize feature engineer
    fe = FeatureEngineer()
    
# Engineer features (fit on train, transform on val/test)
    train_features = fe.engineer_features(train_df, fit=True)
    val_features = fe.engineer_features(val_df, fit=False)
    test_features = fe.engineer_features(test_df, fit=False)
    
# Save transformers
    fe.save_transformers('models/feature_transformers.pkl')
    
# Save engineered features
    feature_cols = fe.get_feature_columns()
    train_features[feature_cols].to_csv('data/train_features.csv', index=False)
    val_features[feature_cols].to_csv('data/val_features.csv', index=False)
    test_features[feature_cols].to_csv('data/test_features.csv', index=False)
    
    print(f"✅ Feature engineering complete: {len(feature_cols)} features")
```

---

## 4. Model Training

### 4.1 XGBoost Model Training

```python
# models/train_model.py
"""
Train XGBoost model for predictive routing
"""
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix,
    classification_report
)
import joblib
import json
from datetime import datetime

class PredictiveRoutingModel:
    """XGBoost model for predicting optimal agent-contact matching"""
    
    def __init__(self, params: dict = None):
        self.params = params or self._get_default_params()
        self.model = None
        self.feature_importance = None
    
    def _get_default_params(self) -> dict:
        """Default XGBoost hyperparameters"""
        return {
            'objective': 'binary:logistic',
            'eval_metric': 'auc',
            'max_depth': 6,
            'learning_rate': 0.1,
            'n_estimators': 100,
            'min_child_weight': 1,
            'subsample': 0.8,
            'colsample_bytree': 0.8,
            'gamma': 0,
            'reg_alpha': 0,
            'reg_lambda': 1,
            'random_state': 42,
            'n_jobs': -1,
            'tree_method': 'hist'
        }
    
    def train(
        self,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        X_val: pd.DataFrame,
        y_val: pd.Series,
        early_stopping_rounds: int = 10
    ):
        """
        Train XGBoost model with early stopping
        
        Args:
            X_train: Training features
            y_train: Training labels
            X_val: Validation features
            y_val: Validation labels
            early_stopping_rounds: Stop if no improvement for N rounds
        """
        print("🚀 Training XGBoost model...")
        print(f"📊 Training samples: {len(X_train):,}")
        print(f"📊 Validation samples: {len(X_val):,}")
        print(f"📊 Features: {X_train.shape[1]}")
        
# Initialize model
        self.model = xgb.XGBClassifier(**self.params)
        
# Train with early stopping
        self.model.fit(
            X_train, y_train,
            eval_set=[(X_train, y_train), (X_val, y_val)],
            eval_metric=['auc', 'logloss'],
            early_stopping_rounds=early_stopping_rounds,
            verbose=10
        )
        
# Store feature importance
        self.feature_importance = pd.DataFrame({
            'feature': X_train.columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print(f"✅ Training complete!")
        print(f"📊 Best iteration: {self.model.best_iteration}")
        print(f"📊 Best score: {self.model.best_score:.4f}")
    
    def evaluate(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        dataset_name: str = "Test"
    ) -> dict:
        """
        Evaluate model performance
        
        Returns:
            Dictionary with performance metrics
        """
        print(f"\n📊 Evaluating on {dataset_name} set...")
        
# Predictions
        y_pred = self.model.predict(X)
        y_pred_proba = self.model.predict_proba(X)[:, 1]
        
# Metrics
        metrics = {
            'accuracy': accuracy_score(y, y_pred),
            'precision': precision_score(y, y_pred),
            'recall': recall_score(y, y_pred),
            'f1_score': f1_score(y, y_pred),
            'roc_auc': roc_auc_score(y, y_pred_proba)
        }
        
# Print metrics
        print(f"\n{dataset_name} Set Performance:")
        print(f"  Accuracy:  {metrics['accuracy']:.4f}")
        print(f"  Precision: {metrics['precision']:.4f}")
        print(f"  Recall:    {metrics['recall']:.4f}")
        print(f"  F1-Score:  {metrics['f1_score']:.4f}")
        print(f"  ROC-AUC:   {metrics['roc_auc']:.4f}")
        
# Confusion matrix
        cm = confusion_matrix(y, y_pred)
        print(f"\nConfusion Matrix:")
        print(f"  TN: {cm[0,0]:,}  FP: {cm[0,1]:,}")
        print(f"  FN: {cm[1,0]:,}  TP: {cm[1,1]:,}")
        
# Classification report
        print(f"\nClassification Report:")
        print(classification_report(y, y_pred, target_names=['Unsuccessful', 'Successful']))
        
        return metrics
    
    def get_top_features(self, n: int = 20) -> pd.DataFrame:
        """Return top N most important features"""
        return self.feature_importance.head(n)
    
    def save_model(self, path: str):
        """Save trained model"""
        joblib.dump(self.model, path)
        print(f"✅ Model saved to {path}")
    
    def load_model(self, path: str):
        """Load trained model"""
        self.model = joblib.load(path)
        print(f"✅ Model loaded from {path}")
    
    def save_metrics(self, metrics: dict, path: str):
        """Save evaluation metrics"""
        metrics['timestamp'] = datetime.now().isoformat()
        with open(path, 'w') as f:
            json.dump(metrics, f, indent=2)
        print(f"✅ Metrics saved to {path}")

# Usage
if __name__ == "__main__":
# Load engineered features
    X_train = pd.read_csv('data/train_features.csv')
    X_val = pd.read_csv('data/val_features.csv')
    X_test = pd.read_csv('data/test_features.csv')
    
# Load targets
    train_df = pd.read_csv('data/train.csv')
    val_df = pd.read_csv('data/val.csv')
    test_df = pd.read_csv('data/test.csv')
    
    y_train = train_df['is_successful']
    y_val = val_df['is_successful']
    y_test = test_df['is_successful']
    
# Initialize model
    model = PredictiveRoutingModel()
    
# Train
    model.train(X_train, y_train, X_val, y_val, early_stopping_rounds=10)
    
# Evaluate
    val_metrics = model.evaluate(X_val, y_val, "Validation")
    test_metrics = model.evaluate(X_test, y_test, "Test")
    
# Save model
    model.save_model('models/predictive_routing_model.pkl')
    model.save_metrics(test_metrics, 'models/model_metrics.json')
    
# Feature importance
    print("\n📊 Top 20 Most Important Features:")
    print(model.get_top_features(20))
```

---

## 5. Hyperparameter Tuning

### 5.1 Optuna-Based Hyperparameter Optimization

```python
# models/hyperparameter_tuning.py
"""
Hyperparameter tuning using Optuna
"""
import optuna
import xgboost as xgb
from sklearn.metrics import roc_auc_score
import pandas as pd
import numpy as np
import joblib

class HyperparameterTuner:
    """Optimize XGBoost hyperparameters using Optuna"""
    
    def __init__(
        self,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        X_val: pd.DataFrame,
        y_val: pd.Series
    ):
        self.X_train = X_train
        self.y_train = y_train
        self.X_val = X_val
        self.y_val = y_val
        self.best_params = None
        self.study = None
    
    def objective(self, trial):
        """Objective function for Optuna"""
# Define hyperparameter search space
        params = {
            'objective': 'binary:logistic',
            'eval_metric': 'auc',
            'tree_method': 'hist',
            'random_state': 42,
            
# Tunable parameters
            'max_depth': trial.suggest_int('max_depth', 3, 10),
            'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
            'n_estimators': trial.suggest_int('n_estimators', 50, 300),
            'min_child_weight': trial.suggest_int('min_child_weight', 1, 10),
            'subsample': trial.suggest_float('subsample', 0.6, 1.0),
            'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
            'gamma': trial.suggest_float('gamma', 0, 5),
            'reg_alpha': trial.suggest_float('reg_alpha', 0, 10),
            'reg_lambda': trial.suggest_float('reg_lambda', 0, 10)
        }
        
# Train model
        model = xgb.XGBClassifier(**params)
        model.fit(
            self.X_train, self.y_train,
            eval_set=[(self.X_val, self.y_val)],
            early_stopping_rounds=10,
            verbose=False
        )
        
# Predict on validation set
        y_pred_proba = model.predict_proba(self.X_val)[:, 1]
        
# Calculate ROC-AUC
        roc_auc = roc_auc_score(self.y_val, y_pred_proba)
        
        return roc_auc
    
    def tune(
        self,
        n_trials: int = 100,
        timeout: int = 3600
    ) -> dict:
        """
        Run hyperparameter optimization
        
        Args:
            n_trials: Number of trials
            timeout: Maximum time in seconds
        
        Returns:
            Best hyperparameters
        """
        print(f"🔍 Starting hyperparameter tuning...")
        print(f"  Trials: {n_trials}")
        print(f"  Timeout: {timeout}s")
        
# Create study
        self.study = optuna.create_study(
            direction='maximize',
            study_name='predictive_routing_optimization'
        )
        
# Optimize
        self.study.optimize(
            self.objective,
            n_trials=n_trials,
            timeout=timeout,
            show_progress_bar=True
        )
        
# Get best parameters
        self.best_params = self.study.best_params
        self.best_params['objective'] = 'binary:logistic'
        self.best_params['eval_metric'] = 'auc'
        self.best_params['tree_method'] = 'hist'
        self.best_params['random_state'] = 42
        
        print(f"\n✅ Tuning complete!")
        print(f"📊 Best ROC-AUC: {self.study.best_value:.4f}")
        print(f"\n📊 Best Parameters:")
        for param, value in self.study.best_params.items():
            print(f"  {param}: {value}")
        
        return self.best_params
    
    def save_best_params(self, path: str):
        """Save best hyperparameters"""
        import json
        with open(path, 'w') as f:
            json.dump(self.best_params, f, indent=2)
        print(f"✅ Best parameters saved to {path}")

# Usage
if __name__ == "__main__":
# Load data
    X_train = pd.read_csv('data/train_features.csv')
    X_val = pd.read_csv('data/val_features.csv')
    y_train = pd.read_csv('data/train.csv')['is_successful']
    y_val = pd.read_csv('data/val.csv')['is_successful']
    
# Initialize tuner
    tuner = HyperparameterTuner(X_train, y_train, X_val, y_val)
    
# Tune (100 trials or 1 hour, whichever comes first)
    best_params = tuner.tune(n_trials=100, timeout=3600)
    
# Save best parameters
    tuner.save_best_params('models/best_hyperparameters.json')
    
# Retrain with best parameters
    from models.train_model import PredictiveRoutingModel
    
    model = PredictiveRoutingModel(params=best_params)
    model.train(X_train, y_train, X_val, y_val)
    model.save_model('models/predictive_routing_model_tuned.pkl')
```

---

**(Continuing in next message due to length...)**

---

**END OF FIRST PART OF APPENDIX B**
## 7. Model Deployment to Vertex AI

### 7.1 Deploy Model to Vertex AI Endpoint

```python
# deployment/deploy_to_vertex_ai.py
"""
Deploy trained model to Vertex AI endpoint for real-time predictions
"""
from google.cloud import aiplatform
from google.cloud.aiplatform import Model, Endpoint
import joblib
from datetime import datetime

class VertexAIDeployer:
    """Deploy model to Vertex AI for production serving"""
    
    def __init__(self, project_id: str, region: str):
        self.project_id = project_id
        self.region = region
        aiplatform.init(project=project_id, location=region)
    
    def upload_model(
        self,
        model_path: str,
        display_name: str,
        description: str = None
    ) -> Model:
        """
        Upload model to Vertex AI Model Registry
        
        Args:
            model_path: Path to saved model file
            display_name: Model display name
            description: Model description
        
        Returns:
            Vertex AI Model object
        """
        print(f"📦 Uploading model to Vertex AI...")
        
# Upload model
        model = aiplatform.Model.upload(
            display_name=display_name,
            artifact_uri=model_path,
            serving_container_image_uri="us-docker.pkg.dev/vertex-ai/prediction/xgboost-cpu.1-6:latest",
            description=description or f"Predictive routing model deployed {datetime.now().isoformat()}",
            labels={"env": "production", "version": "v1"},
        )
        
        print(f"✅ Model uploaded: {model.resource_name}")
        return model
    
    def create_endpoint(self, display_name: str) -> Endpoint:
        """Create Vertex AI endpoint"""
        print(f"🔗 Creating endpoint...")
        
        endpoint = aiplatform.Endpoint.create(
            display_name=display_name,
            description="Real-time predictive routing endpoint",
            labels={"env": "production"}
        )
        
        print(f"✅ Endpoint created: {endpoint.resource_name}")
        return endpoint
    
    def deploy_model_to_endpoint(
        self,
        model: Model,
        endpoint: Endpoint,
        machine_type: str = "n1-standard-4",
        min_replica_count: int = 1,
        max_replica_count: int = 3
    ):
        """
        Deploy model to endpoint with autoscaling
        
        Args:
            model: Vertex AI Model
            endpoint: Vertex AI Endpoint
            machine_type: Machine type for serving
            min_replica_count: Minimum replicas
            max_replica_count: Maximum replicas
        """
        print(f"🚀 Deploying model to endpoint...")
        
        model.deploy(
            endpoint=endpoint,
            deployed_model_display_name="predictive-routing-v1",
            machine_type=machine_type,
            min_replica_count=min_replica_count,
            max_replica_count=max_replica_count,
            accelerator_type=None,  # CPU-only for this use case
            traffic_percentage=100,
            sync=True
        )
        
        print(f"✅ Model deployed successfully!")
        print(f"📊 Endpoint: {endpoint.resource_name}")
        print(f"📊 Machine Type: {machine_type}")
        print(f"📊 Replicas: {min_replica_count}-{max_replica_count}")
    
    def test_endpoint(self, endpoint: Endpoint, test_data: dict):
        """Test deployed endpoint with sample data"""
        print(f"🧪 Testing endpoint...")
        
        prediction = endpoint.predict(instances=[test_data])
        
        print(f"✅ Test prediction successful:")
        print(f"  Probability: {prediction.predictions[0]}")
        
        return prediction

# Usage
if __name__ == "__main__":
    deployer = VertexAIDeployer(
        project_id="kidswear-cc-ai-project",
        region="us-central1"
    )
    
# Upload model
    model = deployer.upload_model(
        model_path="gs://kidswear-cc-models/predictive_routing_model.pkl",
        display_name="predictive-routing-model-v1",
        description="XGBoost model for optimal agent-contact matching"
    )
    
# Create endpoint
    endpoint = deployer.create_endpoint(
        display_name="predictive-routing-endpoint"
    )
    
# Deploy
    deployer.deploy_model_to_endpoint(
        model=model,
        endpoint=endpoint,
        machine_type="n1-standard-4",
        min_replica_count=2,
        max_replica_count=5
    )
    
# Test
    test_data = {
        "hour_sin": 0.5,
        "hour_cos": 0.866,
        "loyalty_tier_encoded": 2,
        "engagement_score": 0.75,
# ... other features
    }
    
    deployer.test_endpoint(endpoint, test_data)
```

---

## 8. Real-Time Prediction API

### 8.1 Flask API for Real-Time Predictions

```python
# api/prediction_api.py
"""
Flask API for real-time predictive routing
"""
from flask import Flask, request, jsonify
from google.cloud import aiplatform
import pandas as pd
import numpy as np
from features.feature_engineering import FeatureEngineer
import joblib
from typing import Dict, List
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize feature engineer
feature_engineer = FeatureEngineer()
feature_engineer.load_transformers('models/feature_transformers.pkl')

# Vertex AI endpoint
ENDPOINT_ID = "projects/123456/locations/us-central1/endpoints/789012"
endpoint = aiplatform.Endpoint(ENDPOINT_ID)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "predictive-routing-api"})

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict optimal agent for incoming contact
    
    Request body:
    {
        "contact_id": "CONT-12345",
        "customer_id": "CUST-67890",
        "available_agents": ["AGENT-1", "AGENT-2", "AGENT-3"],
        "contact_context": {
            "call_reason": "order_status",
            "sentiment_score": 0.2,
            "wait_time_seconds": 45,
            "ivr_path": "main_menu > orders",
            "self_service_attempted": true
        },
        "timestamp": "2025-11-22T10:30:00Z"
    }
    
    Returns:
    {
        "recommended_agent": "AGENT-2",
        "confidence_score": 0.87,
        "agent_rankings": [
            {"agent_id": "AGENT-2", "score": 0.87},
            {"agent_id": "AGENT-1", "score": 0.76},
            {"agent_id": "AGENT-3", "score": 0.65}
        ],
        "reasoning": {
            "top_factors": [
                "agent_performance_score: 0.92",
                "skill_match: 0.88",
                "customer_history: 0.75"
            ]
        }
    }
    """
    try:
# Parse request
        data = request.json
        contact_id = data.get('contact_id')
        customer_id = data.get('customer_id')
        available_agents = data.get('available_agents', [])
        contact_context = data.get('contact_context', {})
        
        logger.info(f"Prediction request for contact {contact_id}")
        
# Validate inputs
        if not available_agents:
            return jsonify({"error": "No available agents provided"}), 400
        
# Score each available agent
        agent_scores = []
        for agent_id in available_agents:
# Fetch agent and customer data
            agent_data = fetch_agent_data(agent_id)
            customer_data = fetch_customer_data(customer_id)
            
# Prepare features
            features = prepare_features(
                customer_data=customer_data,
                agent_data=agent_data,
                contact_context=contact_context
            )
            
# Get prediction
            prediction = endpoint.predict(instances=[features])
            success_probability = prediction.predictions[0]
            
            agent_scores.append({
                "agent_id": agent_id,
                "score": float(success_probability)
            })
        
# Sort by score
        agent_scores.sort(key=lambda x: x['score'], reverse=True)
        
# Get top recommendation
        recommended_agent = agent_scores[0]['agent_id']
        confidence_score = agent_scores[0]['score']
        
# Get top influencing factors
        top_factors = get_top_factors(features)
        
        response = {
            "contact_id": contact_id,
            "recommended_agent": recommended_agent,
            "confidence_score": confidence_score,
            "agent_rankings": agent_scores,
            "reasoning": {
                "top_factors": top_factors
            },
            "timestamp": data.get('timestamp')
        }
        
        logger.info(f"Recommended agent {recommended_agent} with confidence {confidence_score:.2f}")
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def fetch_agent_data(agent_id: str) -> Dict:
    """Fetch agent attributes from database/cache"""
# In production, fetch from database or cache
# Mock data for example
    return {
        "agent_id": agent_id,
        "skill_level": 8,
        "tenure_days": 450,
        "avg_handle_time": 360,
        "avg_csat_score": 4.3,
        "specializations": ["orders", "returns"],
        "current_state": "available"
    }

def fetch_customer_data(customer_id: str) -> Dict:
    """Fetch customer attributes from CRM"""
# Mock data
    return {
        "customer_id": customer_id,
        "age_range": "toddler",
        "loyalty_tier": "Gold",
        "lifetime_value": 15000,
        "previous_contact_count": 8,
        "avg_order_value": 1500,
        "contacts_last_7days": 1,
        "contacts_last_30days": 3,
        "avg_csat_30days": 4.2
    }

def prepare_features(
    customer_data: Dict,
    agent_data: Dict,
    contact_context: Dict
) -> Dict:
    """Prepare feature dictionary for prediction"""
    import datetime
    
# Combine all data
    combined_data = {
        **customer_data,
        **agent_data,
        **contact_context,
        'hour_of_day': datetime.datetime.now().hour,
        'day_of_week': datetime.datetime.now().weekday() + 1
    }
    
# Convert to DataFrame
    df = pd.DataFrame([combined_data])
    
# Engineer features
    features = feature_engineer.engineer_features(df, fit=False)
    
# Get feature columns
    feature_cols = feature_engineer.get_feature_columns()
    
# Return as dict
    return features[feature_cols].iloc[0].to_dict()

def get_top_factors(features: Dict, n: int = 5) -> List[str]:
    """Get top N influencing factors from feature importance"""
# Load feature importance (would be cached in production)
    feature_importance = joblib.load('models/feature_importance.pkl')
    
# Get top features
    top_features = feature_importance.head(n)
    
    return [
        f"{row['feature']}: {features.get(row['feature'], 0):.2f}"
        for _, row in top_features.iterrows()
    ]

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)
```

---

## 9. Model Monitoring

### 9.1 Prometheus Metrics for Monitoring

```python
# monitoring/metrics.py
"""
Prometheus metrics for model monitoring
"""
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time
from functools import wraps

# Prediction metrics
prediction_requests_total = Counter(
    'prediction_requests_total',
    'Total number of prediction requests',
    ['status']
)

prediction_latency_seconds = Histogram(
    'prediction_latency_seconds',
    'Prediction request latency in seconds',
    buckets=[0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0]
)

prediction_score_distribution = Histogram(
    'prediction_score_distribution',
    'Distribution of prediction scores',
    buckets=[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
)

# Model performance metrics
model_accuracy = Gauge(
    'model_accuracy',
    'Current model accuracy'
)

model_roc_auc = Gauge(
    'model_roc_auc',
    'Current model ROC-AUC'
)

feature_drift_score = Gauge(
    'feature_drift_score',
    'Feature drift score (PSI)'
)

# Business metrics
successful_routing_rate = Gauge(
    'successful_routing_rate',
    'Rate of successful contact routing'
)

avg_csat_score = Gauge(
    'avg_csat_score',
    'Average CSAT score for predicted routes'
)

def track_prediction(func):
    """Decorator to track prediction metrics"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        
        try:
            result = func(*args, **kwargs)
            prediction_requests_total.labels(status='success').inc()
            
# Track prediction score
            if 'confidence_score' in result:
                prediction_score_distribution.observe(result['confidence_score'])
            
            return result
            
        except Exception as e:
            prediction_requests_total.labels(status='error').inc()
            raise e
        
        finally:
            latency = time.time() - start_time
            prediction_latency_seconds.observe(latency)
    
    return wrapper

# Start Prometheus metrics server
def start_metrics_server(port: int = 9090):
    """Start Prometheus metrics HTTP server"""
    start_http_server(port)
    print(f"✅ Metrics server started on port {port}")
```

### 9.2 Data Drift Detection

```python
# monitoring/drift_detection.py
"""
Detect feature drift and model degradation
"""
import pandas as pd
import numpy as np
from scipy import stats
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class DriftDetector:
    """Detect feature drift using PSI (Population Stability Index)"""
    
    def __init__(self, reference_data: pd.DataFrame):
        """
        Initialize with reference (training) data
        
        Args:
            reference_data: Training data as reference distribution
        """
        self.reference_data = reference_data
        self.reference_distributions = self._calculate_distributions(reference_data)
    
    def _calculate_distributions(self, data: pd.DataFrame) -> Dict:
        """Calculate distribution for each feature"""
        distributions = {}
        
        for col in data.columns:
            if data[col].dtype in ['int64', 'float64']:
# For numerical features, use histogram bins
                hist, bin_edges = np.histogram(data[col], bins=10)
                distributions[col] = {
                    'hist': hist / len(data),  # Normalize
                    'bin_edges': bin_edges
                }
            else:
# For categorical features, use value counts
                distributions[col] = data[col].value_counts(normalize=True).to_dict()
        
        return distributions
    
    def calculate_psi(
        self,
        current_data: pd.DataFrame,
        threshold: float = 0.2
    ) -> Dict[str, float]:
        """
        Calculate Population Stability Index for each feature
        
        PSI Formula:
        PSI = Σ (Actual% - Expected%) × ln(Actual% / Expected%)
        
        Interpretation:
        PSI < 0.1: No significant drift
        0.1 ≤ PSI < 0.2: Moderate drift
        PSI ≥ 0.2: Significant drift (retrain model)
        
        Args:
            current_data: Current production data
            threshold: PSI threshold for drift alert
        
        Returns:
            Dictionary of PSI scores per feature
        """
        current_dist = self._calculate_distributions(current_data)
        psi_scores = {}
        
        for col in self.reference_distributions:
            if col not in current_dist:
                continue
            
            ref = self.reference_distributions[col]
            curr = current_dist[col]
            
            if isinstance(ref, dict) and 'hist' in ref:
# Numerical feature
                ref_hist = ref['hist']
                bin_edges = ref['bin_edges']
                
# Bin current data using reference bins
                curr_hist, _ = np.histogram(
                    current_data[col],
                    bins=bin_edges
                )
                curr_hist = curr_hist / len(current_data)
                
# Calculate PSI
                psi = self._compute_psi(ref_hist, curr_hist)
                
            else:
# Categorical feature
# Ensure both have same categories
                all_cats = set(ref.keys()) | set(curr.keys())
                ref_probs = np.array([ref.get(cat, 0.0001) for cat in all_cats])
                curr_probs = np.array([curr.get(cat, 0.0001) for cat in all_cats])
                
                psi = self._compute_psi(ref_probs, curr_probs)
            
            psi_scores[col] = psi
            
# Log alert if drift detected
            if psi >= threshold:
                logger.warning(
                    f"⚠️ Drift detected in '{col}': PSI = {psi:.4f} "
                    f"(threshold = {threshold})"
                )
        
        return psi_scores
    
    def _compute_psi(
        self,
        expected: np.ndarray,
        actual: np.ndarray
    ) -> float:
        """
        Compute PSI between expected and actual distributions
        
        Args:
            expected: Reference distribution
            actual: Current distribution
        
        Returns:
            PSI score
        """
# Avoid log(0) by adding small epsilon
        epsilon = 0.0001
        expected = np.where(expected == 0, epsilon, expected)
        actual = np.where(actual == 0, epsilon, actual)
        
        psi = np.sum((actual - expected) * np.log(actual / expected))
        
        return psi
    
    def check_model_degradation(
        self,
        recent_predictions: pd.DataFrame,
        recent_outcomes: pd.Series,
        baseline_accuracy: float,
        threshold: float = 0.05
    ) -> Dict:
        """
        Check if model performance has degraded
        
        Args:
            recent_predictions: Recent model predictions
            recent_outcomes: Actual outcomes for recent predictions
            baseline_accuracy: Baseline accuracy from training
            threshold: Acceptable degradation threshold
        
        Returns:
            Dictionary with degradation metrics
        """
        from sklearn.metrics import accuracy_score, roc_auc_score
        
        current_accuracy = accuracy_score(recent_outcomes, recent_predictions['predicted_class'])
        current_roc_auc = roc_auc_score(recent_outcomes, recent_predictions['predicted_proba'])
        
        degradation = baseline_accuracy - current_accuracy
        
        result = {
            'current_accuracy': current_accuracy,
            'baseline_accuracy': baseline_accuracy,
            'degradation': degradation,
            'degraded': degradation > threshold,
            'current_roc_auc': current_roc_auc
        }
        
        if degradation > threshold:
            logger.warning(
                f"⚠️ Model degradation detected!\n"
                f"  Current accuracy: {current_accuracy:.4f}\n"
                f"  Baseline accuracy: {baseline_accuracy:.4f}\n"
                f"  Degradation: {degradation:.4f} (threshold: {threshold})"
            )
        
        return result

# Usage
if __name__ == "__main__":
# Load reference data (training set)
    reference_data = pd.read_csv('data/train_features.csv')
    
# Load current production data
    current_data = pd.read_csv('data/current_production_features.csv')
    
# Initialize detector
    detector = DriftDetector(reference_data)
    
# Calculate PSI for each feature
    psi_scores = detector.calculate_psi(current_data, threshold=0.2)
    
# Print results
    print("\n📊 Feature Drift Analysis:")
    for feature, psi in sorted(psi_scores.items(), key=lambda x: x[1], reverse=True):
        status = "🚨 DRIFT" if psi >= 0.2 else "⚠️ WATCH" if psi >= 0.1 else "✅ OK"
        print(f"  {status} {feature}: {psi:.4f}")
    
# Check for model degradation
    recent_predictions = pd.read_csv('data/recent_predictions.csv')
    recent_outcomes = pd.read_csv('data/recent_outcomes.csv')['actual']
    
    degradation = detector.check_model_degradation(
        recent_predictions=recent_predictions,
        recent_outcomes=recent_outcomes,
        baseline_accuracy=0.87,
        threshold=0.05
    )
    
    print(f"\n📊 Model Performance:")
    print(f"  Current: {degradation['current_accuracy']:.4f}")
    print(f"  Baseline: {degradation['baseline_accuracy']:.4f}")
    print(f"  Status: {'🚨 DEGRADED' if degradation['degraded'] else '✅ HEALTHY'}")
```

---

## 10. Automated Retraining

### 10.1 Scheduled Retraining Pipeline

```python
# training/automated_retraining.py
"""
Automated model retraining pipeline
"""
import schedule
import time
from datetime import datetime, timedelta
import pandas as pd
import logging
from data.data_extraction import ContactDataExtractor
from features.feature_engineering import FeatureEngineer
from models.train_model import PredictiveRoutingModel
from deployment.deploy_to_vertex_ai import VertexAIDeployer
from monitoring.drift_detection import DriftDetector
import joblib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AutomatedRetrainingPipeline:
    """Automated pipeline for model retraining"""
    
    def __init__(self, config: dict):
        self.config = config
        self.last_training_date = None
        self.baseline_accuracy = None
    
    def should_retrain(self) -> tuple[bool, str]:
        """
        Determine if model should be retrained
        
        Returns:
            (should_retrain: bool, reason: str)
        """
# Check 1: Scheduled retraining (weekly)
        if self.last_training_date:
            days_since_training = (datetime.now() - self.last_training_date).days
            if days_since_training >= 7:
                return True, "scheduled_weekly_retrain"
        else:
            return True, "initial_training"
        
# Check 2: Data drift detection
        try:
            reference_data = pd.read_csv('data/train_features.csv')
            current_data = self._fetch_recent_production_data()
            
            detector = DriftDetector(reference_data)
            psi_scores = detector.calculate_psi(current_data, threshold=0.2)
            
# If any feature has significant drift
            max_psi = max(psi_scores.values())
            if max_psi >= 0.2:
                return True, f"data_drift_detected_psi_{max_psi:.4f}"
        
        except Exception as e:
            logger.error(f"Drift detection failed: {e}")
        
# Check 3: Model degradation
        try:
            recent_predictions = self._fetch_recent_predictions()
            recent_outcomes = self._fetch_recent_outcomes()
            
            detector = DriftDetector(reference_data)
            degradation = detector.check_model_degradation(
                recent_predictions=recent_predictions,
                recent_outcomes=recent_outcomes,
                baseline_accuracy=self.baseline_accuracy,
                threshold=0.05
            )
            
            if degradation['degraded']:
                return True, f"model_degradation_{degradation['degradation']:.4f}"
        
        except Exception as e:
            logger.error(f"Degradation check failed: {e}")
        
        return False, "no_retrain_needed"
    
    def retrain_pipeline(self):
        """Execute full retraining pipeline"""
        logger.info("🚀 Starting automated retraining pipeline...")
        
        try:
# 1. Extract fresh training data
            logger.info("📊 Extracting fresh training data...")
            extractor = ContactDataExtractor(
                bq_client=self.config['bq_client'],
                project_id=self.config['project_id']
            )
            
            df = extractor.extract_historical_contacts(days_lookback=90)
            df = extractor.create_target_variable(df)
            train_df, val_df, test_df = extractor.split_train_test(df)
            
# 2. Feature engineering
            logger.info("🔧 Engineering features...")
            fe = FeatureEngineer()
            train_features = fe.engineer_features(train_df, fit=True)
            val_features = fe.engineer_features(val_df, fit=False)
            test_features = fe.engineer_features(test_df, fit=False)
            
# Save transformers
            fe.save_transformers('models/feature_transformers.pkl')
            
# 3. Train model
            logger.info("🎓 Training new model...")
            feature_cols = fe.get_feature_columns()
            X_train = train_features[feature_cols]
            X_val = val_features[feature_cols]
            X_test = test_features[feature_cols]
            
            y_train = train_df['is_successful']
            y_val = val_df['is_successful']
            y_test = test_df['is_successful']
            
            model = PredictiveRoutingModel()
            model.train(X_train, y_train, X_val, y_val)
            
# 4. Evaluate
            test_metrics = model.evaluate(X_test, y_test, "Test")
            self.baseline_accuracy = test_metrics['accuracy']
            
# 5. Compare with current production model
            logger.info("📊 Comparing with production model...")
            if self._is_new_model_better(test_metrics):
# 6. Deploy new model
                logger.info("🚀 Deploying new model to production...")
                self._deploy_new_model(model, test_metrics)
                
                self.last_training_date = datetime.now()
                logger.info("✅ Retraining pipeline completed successfully!")
            else:
                logger.info("⚠️ New model not better than production, keeping current model")
        
        except Exception as e:
            logger.error(f"❌ Retraining pipeline failed: {e}")
            raise
    
    def _fetch_recent_production_data(self) -> pd.DataFrame:
        """Fetch recent production data for drift detection"""
# Implementation depends on your data storage
# This is a placeholder
        return pd.read_csv('data/recent_production_features.csv')
    
    def _fetch_recent_predictions(self) -> pd.DataFrame:
        """Fetch recent model predictions"""
        return pd.read_csv('data/recent_predictions.csv')
    
    def _fetch_recent_outcomes(self) -> pd.Series:
        """Fetch actual outcomes for recent predictions"""
        return pd.read_csv('data/recent_outcomes.csv')['actual']
    
    def _is_new_model_better(self, new_metrics: dict) -> bool:
        """Compare new model with current production model"""
# Load current production metrics
        try:
            with open('models/production_metrics.json', 'r') as f:
                import json
                current_metrics = json.load(f)
            
# New model must be at least 1% better in ROC-AUC
            improvement = new_metrics['roc_auc'] - current_metrics['roc_auc']
            
            logger.info(
                f"Model comparison:\n"
                f"  Current ROC-AUC: {current_metrics['roc_auc']:.4f}\n"
                f"  New ROC-AUC: {new_metrics['roc_auc']:.4f}\n"
                f"  Improvement: {improvement:.4f}"
            )
            
            return improvement >= 0.01
        
        except FileNotFoundError:
# No production model yet, deploy new one
            return True
    
    def _deploy_new_model(self, model: PredictiveRoutingModel, metrics: dict):
        """Deploy new model to Vertex AI"""
# Save model
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        model_path = f"models/predictive_routing_model_{timestamp}.pkl"
        model.save_model(model_path)
        
# Save metrics as production metrics
        model.save_metrics(metrics, 'models/production_metrics.json')
        
# Deploy to Vertex AI
        deployer = VertexAIDeployer(
            project_id=self.config['project_id'],
            region=self.config['region']
        )
        
# Upload and deploy
        vertex_model = deployer.upload_model(
            model_path=f"gs://kidswear-cc-models/{model_path}",
            display_name=f"predictive-routing-model-{timestamp}"
        )
        
        endpoint = aiplatform.Endpoint(self.config['endpoint_id'])
        
        deployer.deploy_model_to_endpoint(
            model=vertex_model,
            endpoint=endpoint,
            min_replica_count=2,
            max_replica_count=5
        )
    
    def run_scheduler(self):
        """Run scheduled retraining checks"""
        logger.info("🕐 Starting retraining scheduler...")
        
# Check daily at 2 AM
        schedule.every().day.at("02:00").do(self._scheduled_check)
        
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    
    def _scheduled_check(self):
        """Scheduled retraining check"""
        logger.info("🔍 Running scheduled retraining check...")
        
        should_retrain, reason = self.should_retrain()
        
        if should_retrain:
            logger.info(f"🚀 Retraining triggered: {reason}")
            self.retrain_pipeline()
        else:
            logger.info(f"✅ No retraining needed: {reason}")

# Usage
if __name__ == "__main__":
    from config.gcp_setup import GCPConfig
    
    config = GCPConfig(
        project_id="kidswear-cc-ai-project",
        region="us-central1",
        credentials_path="/path/to/credentials.json"
    )
    
    pipeline = AutomatedRetrainingPipeline(config={
        'bq_client': config.get_bigquery_client(),
        'project_id': config.project_id,
        'region': config.region,
        'endpoint_id': "projects/123456/locations/us-central1/endpoints/789012"
    })
    
# Run scheduler (runs forever)
    pipeline.run_scheduler()
```

---

**Last Updated:** March 2026  
**Author:** Rajmohan M, Principal Consultant

---

**END OF APPENDIX B**
