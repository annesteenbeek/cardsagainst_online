'use strict'
const fs = require('fs');
const utils = require('./utils');


const cah_file = './lib/cah.json'
const cah = JSON.parse(fs.readFileSync(cah_file))
const decks = createDecks();

/**
 * Create dictionary that can be sent to the frontend.
 */
function createDecks() {
    let order = cah['order']
    let decks = {order}
    for (const abr of order) {
        decks[abr] = {
            name: cah[abr]['name'],
            nblack: cah[abr]['black'].length,
            nwhite: cah[abr]['white'].length,
            icon: cah[abr].icon,
            key: abr
        }
    }
    
    return decks
}

/**
 *  Construct dictionary of card IDs belonging to the collection of decks. 
 * @param {[string]} decks Array of deck abbreviations
 */
function getCards(decks) {
    let cards = {
            black: [],
            white: []
        }

    for (const abr of decks) {
        cards['black'].push(...cah[abr]['black'])
        cards['white'].push(...cah[abr]['white'])
    }

    utils.shuffle(cards['black']);
    utils.shuffle(cards['white']);

    return cards
}

function getWhite(ids) {
    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    return ids.map(id => cah['whiteCards'][id])
}

function getBlack(id) {
    return cah['blackCards'][id]
}


module.exports.decks = decks;
module.exports.getCards = getCards;
module.exports.getWhite = getWhite;
module.exports.getBlack = getBlack;
