import kagglehub

# Download latest version
path = kagglehub.dataset_download("danielcalvoglez/us-tariffs-2025")

print("Path to dataset files:", path)