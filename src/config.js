module.exports = {
    urls: {
        forecast: 'https://utahavalanchecenter.org/advisory/',
        observations: '/observations/${region}/json',
        advisory: '/advisory/${region}/json'
    },
    timeout: 1500,
    UA: 'steve.gourley@gmail.com;https://github.com/steveoh/alexa-utah-avy-skill;amazon-alexa-skill'
};
