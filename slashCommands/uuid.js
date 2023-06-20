const { MessageEmbed } = require("discord.js");

const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const BLSettings = require('./../models/bl');
const asSettings = require('./../models/as');
const moment = require('moment');
const fetch = require("node-fetch");
const config = require(`./../botconfig/config.json`);


module.exports = {
    name: "uuid", //the command name for the Slash Command
    description: "Trouver l'UUID d'un joueur", //the command description for Slash Command Overview
    cooldown: 5,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        { "String": { name: "pseudo", description: "Quel joueur cherchez-vous ?", required: true } }, //to use in the code: interacton.getString("title")
        //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        //{"Channel": { name: "in_where", description: "In What Channel should I send it?", required: false }}, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")

    ],
    run: async (client, interaction, message) => {
        try {


            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;


            const pseudo = options.getString("pseudo");

            const embedintrouvable = new MessageEmbed()
            .setTitle(`Joueur introuvable !`)
            .setColor("#ff0000")
            .setDescription(`Le joueur ne semble pas exister ou n'est pas trouvable !`)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
        
            
            const mojangapi = await fetch(`https://api.mojang.com/users/profiles/minecraft/${pseudo}`);
            const data = await mojangapi.json().catch(function(error) {
                interaction.reply({ embeds: [embedintrouvable] })
            });
            
          
            try {
                var uuid = data.id;
                var pseudo2 = data.name
                if (uuid == undefined) {
                    return interaction.reply({ embeds: [embedintrouvable] });
                };
            } catch (error) {
                return interaction.reply({ embeds: [embedintrouvable] });
            };
        
            const regex =/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/;
            let uuid2 = uuid.replace(regex, '$1-$2-$3-$4-$5');
        
            const embed = new MessageEmbed()
            .setTitle(`UUID de \`${pseudo2}\` :`)
            .setDescription(`__**uuid :**__ \`${uuid2}\`\n__**uuid BDD :**__ \`${uuid}\`\n__**Commande BDD :**__ \`{uuid : '${uuid}'}\``)
            .setURL(`https://sky.shiiyu.moe/stats/${pseudo2}/`)
            .setThumbnail(`https://crafatar.com/renders/body/${uuid}?overlay`)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setColor(ee.color)
            interaction.reply({ embeds: [embed] })





        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}