# alexa-utah-avy-skill

an alexa skill to speak the utah avalanche forecast

### Data
- `/observations/{region}/json`
- `/advisory/{region}/json`
**region**: `logan`, `ogden`, `salt-lake`, `provo`, `skyline`, `moab`

## Development

1. npm install
1. npm test

## Publishing

1. npm prune --production
1. npm run package
1. login to https://console.aws.amazon.com/lambda/home
1. upload zip file created
