const baseUrl = 'https://utahavalanchecenter.org/';
module.exports = {
    urls: {
        observations: baseUrl + '/observations/${region}/json',
        advisory: baseUrl + '/advisory/${region}/json'
    },
    timeout: 1500,
    UA: 'steve.gourley@gmail.com;https://github.com/steveoh/alexa-utah-avy-skill;amazon-alexa-skill',
    text: {
        xhr: {
            forecastError: 'There was an error with the Utah Avalanche website. Please try again later.'
        },
        help: 'This skill reads the avalanche forecast for the six regions the UAC monitors. ' +
            'Tell me where you are going. You can say logan, ogden, salt lake, provo, ' +
            '<phoneme alphabet="ipa" ph="ˈskaɪlaɪn">skyline</phoneme>, or ' +
            '<phoneme alphabet="ipa" ph="moʊæb">moab</phoneme>?',
        welcome: 'This is the Utah Avalanche Center. ' +
            'Where will you be <phoneme alphabet="ipa" ph="\'rɛk\'ri.eɪtɪŋ">recreate</phoneme> today?'
    }
};
