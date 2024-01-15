# build.ps1

# Stop the script if any command fails
$ErrorActionPreference = "Stop"

# Run the build command
Write-Host "Running build command..."
ng deploy

# Run the deployment command
Write-Host "Running deployment command..."
npx angular-cli-ghpages --dir=dist/browser

Write-Host "Done."
