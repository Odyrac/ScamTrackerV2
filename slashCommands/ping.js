const { MessageEmbed } = require("discord.js");

const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const BLSettings = require('./../models/bl');
const asSettings = require('./../models/as');
const moment = require('moment');
const fetch = require("node-fetch");
const config = require(`./../botconfig/config.json`);


module.exports = {
    name: "ping", //the command name for the Slash Command
    description: "Ping du bot", //the command description for Slash Command Overview
    cooldown: 5,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        //{ "String": { name: "pseudo", description: "Quel joueur check ?", required: true } }, //to use in the code: interacton.getString("title")
        //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        //{"Channel": { name: "in_where", description: "In What Channel should I send it?", required: false }}, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")

    ],
    run: async (client, interaction, message) => {
        try {


            const ping = client.ws.ping;
            const embed = new MessageEmbed()
                .setTitle(`🏓 Pong : \`${ping}ms\``)
                .setColor(ee.color)

                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            interaction.reply({ embeds: [embed] })



        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}