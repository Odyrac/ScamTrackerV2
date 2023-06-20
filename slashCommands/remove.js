const { MessageEmbed } = require("discord.js");

const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const BLSettings = require('./../models/bl');
const asSettings = require('./../models/as');
const moment = require('moment');
const fetch = require("node-fetch");
const config = require(`./../botconfig/config.json`);


module.exports = {
    name: "remove", //the command name for the Slash Command
    description: "Permet de retirer un joueur de la ScamList", //the command description for Slash Command Overview
    cooldown: 5,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: ['828015879421820989'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        { "String": { name: "pseudo", description: "Le joueur à remove", required: true } },
        { "String": { name: "raison", description: "Raison du remove", required: true } }, //to use in the code: interacton.getString("title")
        //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        //{"Channel": { name: "in_where", description: "In What Channel should I send it?", required: false }}, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")

    ],
    run: async (client, interaction, message) => {
        try {
            //console.log(interaction, StringOption)

            //things u can directly access in an interaction!
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const { guild } = member;
            //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
            const pseudo = options.getString("pseudo"); 
            const reason = options.getString("raison"); //same as in StringChoices //RETURNS STRING 
            //let UserOption = options.getUser("OPTIONNAME"); //RETURNS USER OBJECT 

            

            const supportserver = client.guilds.cache.get('827226531226976296')
            const logsChannel = supportserver.channels.cache.get('827545549242368020');
      
            
            const embedintrouvable = new MessageEmbed()
            .setTitle(`Joueur introuvable !`)
            .setColor("#ff0000")
            .setDescription(`Le joueur ne semble pas exister ou n'est pas trouvable !`)
      
            const mojangapi = await fetch(`https://api.mojang.com/users/profiles/minecraft/${pseudo}`);
            const data = await mojangapi.json().catch(function(error) {
                interaction.reply({ embeds: [embedintrouvable] });
            });
            console.log(data)
      
            try {
              var uuid = data.id;
              var pseudo2 = data.name
              if (uuid == undefined) {
                  return interaction.reply({ embeds: [embedintrouvable] });
              };
          } catch (error) {
              return interaction.reply({ embeds: [embedintrouvable] });
          };
      
            let author_tag = `${interaction.user.username}#${interaction.user.discriminator}`;
      
            const embed = new MessageEmbed()
            .setTitle(`\`${pseudo2}\` a été retiré de la ScamList !`)
            .setThumbnail(`https://crafatar.com/renders/body/${uuid}?overlay`)
            .setColor("#35f009")
            .setDescription(`Il n'est plus présent dans notre base de données et son \`/check ${pseudo2}\` est redevenu normal.\n\n__**Retiré par :**__ ${author_tag}\n__**Raison :**__ ${reason}`)
            .setFooter({text: ee.footertext, iconURL: ee.footericon})
      
            const logembed = new MessageEmbed()
            .setTitle(`Un joueur a été retiré de la ScamList !`)
            .setColor('#ee942e')
            .setDescription(`__**Pseudo :**__ \`${pseudo2}\`\n__**Par :**__ \`${author_tag}\`\n__**Raison :**__ ${reason}\n__**Serveur :**__ ${interaction.guild.id}`)
            .setTimestamp()
            .setFooter({text: author_tag, iconURL: interaction.user.displayAvatarURL()});
      
            const previousBL = await BLSettings.find({
              uuid: uuid,
            });
            const currentlyBL = previousBL.filter((BL) => {
              return BL.current === true;
            });
      
            const previousas = await asSettings.find({
              uuid: uuid,
            });
            const currentlyas = previousas.filter((as) => {
              return as.current === true;
            });
            
            if (currentlyBL.length) {
              const msg = await logsChannel.send({ embeds: [logembed] });
              msg.crosspost();
      
              await BLSettings.deleteOne({
                uuid: uuid,
              })
              
              interaction.reply({ embeds: [embed] })
      
            } else {
              if (currentlyas.length) {
                const msg = await logsChannel.send({ embeds: [logembed] });
                msg.crosspost();
        
                await asSettings.deleteOne({
                  uuid: uuid,
                })
                
                interaction.reply({ embeds: [embed] })
      
              } else {
                const embederror = new MessageEmbed()
                .setTitle(`Joueur non-présent !`)
                .setColor("#ff0000")
                .setDescription(`Ce joueur n'est dans aucune base de données !`)
                return interaction.reply({ embeds: [embederror] })
              }
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}