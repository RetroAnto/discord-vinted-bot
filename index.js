require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Initialisation du client Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Variables d'environnement
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GAS_URL = process.env.GAS_URL;  // L'URL de l'application Google Apps Script

// Connexion au bot
client.once('ready', () => {
    console.log('Le bot est en ligne !');
});

// Commande pour gérer les recherches
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;  // Ignore les messages des autres bots
    const args = message.content.split(' ');

    // Commande !vinted
    if (args[0] === '!vinted') {
        const command = args[1];
        const searchName = args.slice(2).join(' ');

        if (command === 'add' && searchName) {
            await addSearch(message, searchName);
        } else if (command === 'remove' && searchName) {
            await removeSearch(message, searchName);
        } else if (command === 'list') {
            await listSearches(message);
        } else {
            message.reply('Commande invalide. Utilise !vinted add <nom recherche>, !vinted remove <nom recherche>, ou !vinted list.');
        }
    }
});

// Ajouter une recherche
async function addSearch(message, searchName) {
    try {
        const response = await axios.post(GAS_URL + '/addSearch', { searchName });
        message.reply(`Recherche '${searchName}' ajoutée avec succès !`);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la recherche:', error);
        message.reply('Il y a eu une erreur en ajoutant la recherche.');
    }
}

// Supprimer une recherche
async function removeSearch(message, searchName) {
    try {
        const response = await axios.post(GAS_URL + '/removeSearch', { searchName });
        message.reply(`Recherche '${searchName}' supprimée avec succès !`);
    } catch (error) {
        console.error('Erreur lors de la suppression de la recherche:', error);
        message.reply('Il y a eu une erreur en supprimant la recherche.');
    }
}

// Lister les recherches
async function listSearches(message) {
    try {
        const response = await axios.get(GAS_URL + '/listSearches');
        if (response.data.length === 0) {
            message.reply('Aucune recherche trouvée.');
        } else {
            message.reply('Recherches actives :\n' + response.data.join('\n'));
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des recherches:', error);
        message.reply('Il y a eu une erreur en récupérant les recherches.');
    }
}

// Connecter le bot
client.login(DISCORD_TOKEN);
