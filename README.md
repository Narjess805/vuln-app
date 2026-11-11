# TP10 — DevSecOps « Shift Left »

Analyse d'une application volontairement vulnérable avec les outils open source standard (Gitleaks, Semgrep, Trivy, CodeQL, Dependabot) et intégration dans GitHub Actions et Jenkins.

## 📸 Captures

| Fichier | Contenu |
|---|---|
| `gitleaks.png` | Secrets détectés par Gitleaks |
| `pre-commit-blocked.png` | Commit refusé par le hook pre-commit |
| `semgrep-before-after.png` | Résultats Semgrep avant/après correction |
| `trivy-before-after.png` | Vulnérabilités de l'image avant/après |
| `dependabot-pr.png` | Pull Request ouverte par Dependabot |
| `codeql-alerts.png` | Alertes CodeQL dans l'onglet Security |
| `pr-blocked.png` | PR bloquée par un check de sécurité obligatoire |
| `jenkins-security.png` | Pipeline Jenkins rouge puis vert |
