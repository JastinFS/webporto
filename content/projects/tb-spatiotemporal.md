---
title: "Tuberculosis Spatio-Temporal Prediction & WebGIS — Semarang"
short: "TB Spread Prediction"
order: 1
featured: true
category: "Undergraduate Thesis · Published Journal Article"
tags:
  - "Python"
  - "Scikit-learn"
  - "CatBoost"
  - "XGBoost"
  - "Random Forest"
  - "Stacking Ensemble"
  - "WebGIS"
cover: "/uploads/proj-tb.webp"
gallery:
  - "/uploads/proj-detail-tb-0.webp"
  - "/uploads/proj-detail-tb-1.webp"
  - "/uploads/proj-detail-tb-2.webp"
  - "/uploads/proj-detail-tb-3.webp"
repo: ""
demo: ""
---
Sistem machine learning untuk menganalisis dan memprediksi persebaran kasus tuberkulosis di **39 wilayah administratif Kota Semarang**, menggunakan 21.437 rekaman kasus historis (2019–2025).

- Data preprocessing, EDA, dan feature engineering — fitur temporal (Lag_1, Lag_2, Rolling_3) dan fitur spasial dari encoded districts.
- Membandingkan Random Forest, XGBoost, CatBoost, dan Stacking Ensemble; tuning hyperparameter dengan RandomizedSearchCV + 5-Fold TimeSeriesSplit.
- Model terbaik (**CatBoost**): R² 0.9461, MAE 0.7293, akurasi backtesting tingkat kota 95,1%.
- Konsep visualisasi berbasis WebGIS untuk menyajikan distribusi spasial dan hasil prediksi.
- Dipublikasikan sebagai artikel jurnal (TechnoCOM, 16 referensi IEEE).
