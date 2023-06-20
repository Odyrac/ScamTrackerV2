const { MessageEmbed } = require("discord.js");

const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const BLSettings = require('./../models/bl');
const asSettings = require('./../models/as');
const infosSettings = require('./../models/infos');
const moment = require('moment');
const fetch = require("node-fetch");
const config = require(`./../botconfig/config.json`);


module.exports = {
    name: "check", //the command name for the Slash Command
    description: "Permet de check un joueur", //the command description for Slash Command Overview
    cooldown: 5,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        { "String": { name: "pseudo", description: "Quel joueur check ?", required: true } }, //to use in the code: interacton.getString("title")
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
            const { guild } = member;
            const Text = options.getString("pseudo");
            let pseudo_donne = Text;




            var embed_pub = new MessageEmbed()
                .setTitle(`[PUBLICITÉ] Devenez sponsor !`)
                .setColor("#ffbd59")
                .setDescription(`Mettez en avant votre serveur Discord ou votre projet devant plus de __**12 000**__ personnes ! Plus d'infos : \`/sponsor\``)
                .setImage(`https://i.imgur.com/BKCivns.png`)
            var random = Math.floor(Math.random() * 3) + 1;



            //permet d'avoir un retour de cb de check sont faits par jour
            var date = new Date();
            var jour = date.getDate();
            var mois = date.getMonth() + 1;
            var annee = date.getFullYear();
            var date_complete = jour + "/" + mois + "/" + annee;
            const today = await infosSettings.findOne({ day: date_complete });
            if (today) {
                await infosSettings.updateOne(
                    { day: date_complete },
                    {
                      $set: {
                        nb_check: today.nb_check + 1,
                      },
                    }
                  );
            } else {
                new infosSettings({
                    day: date_complete,
                    nb_check: 1,
                    timestamp: date.getTime(),
                }).save().catch((error) => console.log(error));
            };





            

            const embed_introuvable = new MessageEmbed()
                .setTitle(`Joueur introuvable !`)
                .setColor("#ff0000")
                .setDescription(`Le joueur ne semble pas exister ou n'est pas trouvable !`)



            const mojangapi = await fetch(`https://api.mojang.com/users/profiles/minecraft/${pseudo_donne}`);
            const data = await mojangapi.json().catch(function (error) {
                return interaction.reply({ embeds: [embed_introuvable] });
            });

            try {

                var uuid = data.id;
                var pseudo_valide = data.name
                if (uuid == undefined) {
                    return interaction.reply({ embeds: [embed_introuvable] });
                };
            } catch (error) {
                return interaction.reply({ embeds: [embed_introuvable] });
            };

            const hyapi = await fetch(`https://api.hypixel.net/player?uuid=${uuid}&key=${config.api_key}`);
            const data2 = await hyapi.json().catch(function (error) {
                interaction.reply(`L'API d'Hypixel semble être down.`);

            });



            const embed_clean = new MessageEmbed()
                .setTitle(`✅ Informations du joueur : ✅`)
                .setDescription(`Si jamais tu te fais arnaquer, va voir le staff d'un de nos serveurs Discord partenaires (\`/infos\`) afin d'ajouter un joueur à notre ScamList.`)
                .addFields({ name: "• __**ScamList :**__", value: `\`${pseudo_valide}\` __**n'est pas**__ dans notre ScamList` })
                .setURL(`https://sky.shiiyu.moe/stats/${pseudo_valide}/`)
                .setThumbnail(`https://crafatar.com/avatars/${uuid}?overlay`)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setColor("#35f009")

            const embed_refund = new MessageEmbed()
                .setTitle(`🔸 Informations du joueur : 🔸`)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setURL(`https://sky.shiiyu.moe/stats/${pseudo_valide}/`)
                .setColor("#ee942e")
                .setThumbnail(`https://crafatar.com/avatars/${uuid}?overlay`)

            const embed_scammer = new MessageEmbed()
                .setTitle(`⛔ Informations du joueur : ⛔`)
                .setColor("#ff0000")
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setURL(`https://sky.shiiyu.moe/stats/${pseudo_valide}/`)
                .setThumbnail(`https://crafatar.com/avatars/${uuid}?overlay`)




            // API HYPIXEL
            var pseudo3 = 'Aucun pseudo.'
            try {
                /*var controller = new AbortController();
                const signal = controller.signal
                setTimeout(() => controller.abort(), 1000);
                */
                pseudo3 = data2.player.displayname
                const hyapi2 = await fetch(`https://api.hypixel.net/guild?key=${config.api_key}&player=${uuid}`);
                const data3 = await hyapi2.json()
                var guilde = 'Aucune guilde.'
                try {
                    guilde = data3.guild.name
                } catch {
                    console.log("Il n'a pas de guilde.")
                }

                var rank = data2.player.newPackageRank
                var mvp = data2.player.monthlyPackageRank
                var xp = data2.player.networkExp
                var level2 = (Math.sqrt((2 * xp) + 30625) / 50) - 2.5
                var level = Math.round(level2 * 100) / 100
                var karma = data2.player.karma
                function formatNumber(num) {
                    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
                }

                var first = data2.player.firstLogin
                var firstbis = moment(first).format('DD/MM/YYYY')
                var last = data2.player.lastLogin
                var lastbis = moment(last).format('DD/MM/YYYY')
                var last2 = data2.player.lastLogout
                var pre = 'null'
                if (last2 < last) {
                    pre = '🟢 Connecté sur Hypixel.'
                } else {
                    pre = '🔴 Non-connecté sur Hypixel.'
                }
                var langue = data2.player.userLanguage
                var version = data2.player.mcVersionRp
                var discord = 'Aucun Discord lié.'
                try {
                    if (data2.player.socialMedia.links.DISCORD != undefined) {
                        discord = data2.player.socialMedia.links.DISCORD
                    }
                } catch (error) {
                    console.log("Il n'a pas de Discord lié.")

                }
                if (rank === 'MVP_PLUS') {
                    rank = 'MVP+'
                } else if (rank === 'VIP_PLUS') {
                    rank = 'VIP+'
                }
                if (!rank) {
                    rank = 'Aucun grade.'
                }
                if (mvp === 'SUPERSTAR') {
                    rank = 'MVP++'
                }
                if (!langue) {
                    langue = 'Langue inconnue.'
                }
                if (langue === 'FRENCH') {
                    langue = ':flag_fr: Français'
                } else if (langue === 'ENGLISH') {
                    langue = ':flag_gb: Anglais'
                }
                embed_clean.addFields({ name: "• __**Rank :**__", value: `${rank}` })
                embed_clean.addFields({ name: "• __**Level :**__", value: `${level}` })
                embed_clean.addFields({ name: "• __**Guilde :**__", value: `${guilde}` })
                embed_clean.addFields({ name: "• __**Première connexion :**__", value: `${firstbis}` })
                embed_clean.addFields({ name: "• __**Dernière connexion :**__", value: `${lastbis}` })
                embed_clean.addFields({ name: "• __**Discord :**__", value: `${discord}` })
                //embed_clean.addFields("• __**Derniers pseudos :**__", `${allpseudos}`)
                embed_clean.addFields({ name: "\u200B", value: `${pre}` })

                embed_scammer.addFields({ name: "• __**Rank :**__", value: `${rank}` })
                embed_scammer.addFields({ name: "• __**Level :**__", value: `${level}` })
                embed_scammer.addFields({ name: "• __**Guilde :**__", value: `${guilde}` })
                embed_scammer.addFields({ name: "• __**Première connexion :**__", value: `${firstbis}` })
                embed_scammer.addFields({ name: "• __**Dernière connexion :**__", value: `${lastbis}` })
                embed_scammer.addFields({ name: "• __**Discord :**__", value: `${discord}` })
                //embed_scammer.addFields("• __**Derniers pseudos :**__", `${allpseudos}`)
                embed_scammer.addFields({ name: "\u200B", value: `${pre}` })

                embed_refund.addFields({ name: "• __**Rank :**__", value: `${rank}` })
                embed_refund.addFields({ name: "• __**Level :**__", value: `${level}` })
                embed_refund.addFields({ name: "• __**Guilde :**__", value: `${guilde}` })
                embed_refund.addFields({ name: "• __**Première connexion :**__", value: `${firstbis}` })
                embed_refund.addFields({ name: "• __**Dernière connexion :**__", value: `${lastbis}` })
                embed_refund.addFields({ name: "• __**Discord :**__", value: `${discord}` })
                //embed_refund.addFields("• __**Derniers pseudos :**__", `${allpseudos}`)
                embed_refund.addFields({ name: "\u200B", value: `${pre}` })

            } catch (error) {
                console.log('ici2')
                embed_clean.addFields({ name: "• __**Remarque :**__", value: "De nombreuses informations ne sont pas disponibles car l'API Hypixel du joueur semble inaccessible." })
                embed_scammer.addFields({ name: "• __**Remarque :**__", value: "De nombreuses informations ne sont pas disponibles car l'API Hypixel du joueur semble inaccessible." })
                embed_refund.addFields({ name: "• __**Remarque :**__", value: "De nombreuses informations ne sont pas disponibles car l'API Hypixel du joueur semble inaccessible." })
                console.log(error)
            }










            const results = await BLSettings.findOne({
                uuid: uuid,
            });
            const results2 = await asSettings.findOne({
                uuid: uuid,
            });



            if (!results) {
                if (!results2) {
                    if (random == 1 || random == 2) {
                        return interaction.reply({ embeds: [embed_clean, embed_pub] });
                    } else {
                        return interaction.reply({ embeds: [embed_clean] });
                    };
                } else {
                    embed_refund.setDescription(`Ce joueur a scam par le passé mais a remboursé la totalité du stuff volé. Tu peux trade avec lui mais soit vigilant !\n\n• __**ScamList :**__\n\`${pseudo_valide}\` __**a été**__ dans notre ScamList\n__Ajouté dans la ScamList le :__ ${moment(results2.timestampa).format('DD/MM/YYYY')}\n__A tout remboursé le :__ ${moment(results2.timestamp).format('DD/MM/YYYY')}\n__Raison de l'ancien scam :__ ${results2.reasona}`)
                    if (random == 1 || random == 2) {
                        return interaction.reply({ embeds: [embed_refund, embed_pub] });
                    } else {
                        return interaction.reply({ embeds: [embed_refund] });
                    };
                }
            } else {
                let dequi = await client.users.fetch(results.author);
                dequi = `${dequi.username}#${dequi.discriminator}`;
                embed_scammer.setDescription(`Nous te conseillons de ne pas trade avec lui. Si jamais tu penses que c'est une erreur, va voir le staff d'un de nos serveurs Discord partenaires (\`/infos\`).\n\n• __**ScamList :**__\n\`${pseudo_valide}\` __**est**__ dans notre ScamList\n__Depuis le :__ ${moment(results.timestamp).format('DD/MM/YYYY')}\n__Raison :__ ${results.reason}\n__Ajouté par :__ ${dequi}`);
                if (random == 1 || random == 2) {
                    return interaction.reply({ embeds: [embed_scammer, embed_pub] });
                } else {
                    return interaction.reply({ embeds: [embed_scammer] });
                };
            }



        } catch (e) {
            console.log(String(e.stack).bgRed)
        }


    }
}