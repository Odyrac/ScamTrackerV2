const { MessageEmbed } = require("discord.js");

const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const BLSettings = require('./../models/bl');
const asSettings = require('./../models/as');
const moment = require('moment');
const fetch = require("node-fetch");
const config = require(`./../botconfig/config.json`);


module.exports = {
    name: "edit", //the command name for the Slash Command
    description: "Permet de modifier la raison d'ajout d'un joueur", //the command description for Slash Command Overview
    cooldown: 5,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: ['828015879421820989'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        { "String": { name: "pseudo", description: "Le joueur à add", required: true } },
        //{ "String": { name: "raison", description: "Raison de l'ajout", required: true } }, //to use in the code: interacton.getString("title")
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
            //const reason = options.getString("raison"); //same as in StringChoices //RETURNS STRING 
            //let UserOption = options.getUser("OPTIONNAME"); //RETURNS USER OBJECT 

            

            const embedintrouvable = new MessageEmbed()
            .setTitle(`Joueur introuvable !`)
            .setColor("#ff0000")
            .setDescription(`Le joueur ne semble pas exister ou n'est pas trouvable !`)
    

            const mojangapi = await fetch(`https://api.mojang.com/users/profiles/minecraft/${pseudo}`);
            const data = await mojangapi.json().catch(function(error) {
                interaction.reply({ embeds: [embedintrouvable] });
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

            let author_tag = `${interaction.user.username}#${interaction.user.discriminator}`;
    
            const embedno = new MessageEmbed()
            .setTitle(`Joueur non-présent !`)
            .setDescription(`\`${pseudo2}\` n'est pas dans notre base de données. Vous ne pouvez donc pas modifier la raison pour laquelle il y est. Ajoutez le avec la commande \`/add ${pseudo2} [raison]\`.`)
            .setColor("#ff0000")
    
            const results = await BLSettings.findOne({
              uuid: uuid,
            });
            if (!results) {
              return interaction.reply({ embeds: [embedno] })
            }
    
            const embed = new MessageEmbed()
            .setTitle(`Menu édition :`)
            .setColor(ee.color)
            .setDescription(`Ici, vous pourrez éditer la raison d'ajout de \`${pseudo2}\` dans notre base de données. Le prochain message que vous enverrez dans ce channel sera sa nouvelle raison d'ajout.\n\n__**Attention :**__ si vous souhaitez conserver la raison précédente, pensez à la remettre dans le nouveau message. Vous pouvez la copier coller ici :\n\n\`${results.reason}\``)
            .setFooter({text: ee.footertext, iconURL: ee.footericon})

    
            const filter = msg => msg.author.id === interaction.user.id && msg.channel.id === interaction.channelId;
            await interaction.reply({ embeds: [embed] });
            
            interaction.channel.awaitMessages({filter: filter, max: 1 }).then(async collected => {
               
              const msg = collected.first();
              
              msg.delete();
    
              await BLSettings.updateOne(
                { uuid: results.uuid },
                {
                  $set: {
                    reason: msg.content,
                  },
                }
              )
            
              const embed2 = new MessageEmbed()
              .setTitle(`Raison changée !`)
              .setColor("#35f009")
              .setDescription(`__Nouvelle raison de \`${pseudo2}\` :__\n\n\`${msg.content}\``)
              .setFooter({text: ee.footertext, iconURL: ee.footericon})
              interaction.channel.send({ embeds: [embed2] });
    
              const guild = client.guilds.cache.get('827226531226976296')
              const logsChannel = guild.channels.cache.get('827545549242368020');
              const logembed = new MessageEmbed()
              .setTitle(`Une raison d'ajout a été changée !`)
              .setColor('#ee942e')
              .setDescription(`__**Pseudo :**__ \`${pseudo2}\`\n__**Par :**__ \`${author_tag}\`\n__**Serveur :**__ ${interaction.guildId}\n__**Ancienne raison :**__ \`${results.reason}\`\n__**Nouvelle raison :**__ \`${msg.content}\``)
              .setTimestamp()
              .setFooter({text: author_tag, iconURL: interaction.user.displayAvatarURL()});
              const msg2 = await logsChannel.send({ embeds: [logembed] });
              msg2.crosspost();
    
            });


        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}