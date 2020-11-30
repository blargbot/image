const Eris = require('eris');

class DiscordClient extends Eris.Client {
    constructor(website) {
        super(_config.discord.token, {
            disableEvents: {
                TYPING_START: true,
                VOICE_STATE_UPDATE: true,
                MESSAGE_CREATE: true,
                MESSAGE_UPDATE: true,
                MESSAGE_DELETE: true,
                MESSAGE_DELETE_BULK: true,
                PRESENCE_UPDATE: true,
                CHANNEL_CREATE: true,
                CHANNEL_UPDATE: true,
                CHANNEL_DELETE: true,
                GUILD_BAN_ADD: true,
                GUILD_BAN_REMOVE: true
            },
            intents: [
                'guilds',
                'guildMembers'
            ],
            getAllUsers: true,
            autoReconnect: true,
            restMode: true,
            messageLimit: 0
        });
        this.website = website;
        global._bot = this;
        this.on('ready', this.onReady.bind(this));
        this.on('guildCreate', this.guildCreate.bind(this));
        this.on('guildMemberRemove', this.guildMemberRemove.bind(this));
        this.on('guildMemberAdd', this.guildMemberAdd.bind(this));

        this.connect();
    }

    async onReady() {
        console.info('Bot is ready.');
    }

    async guildCreate(guild) {
        if (guild.id !== '194232473931087872')
            guild.leave();
    }

    async guildMemberAdd(guild, member) {
        let user = await _dbModels.User.findOne({ where: { userid: member.user.id } });
        if (user) {
            await member.addRole('446010037702230016', 'User has API Access');
        }
    }

    async guildMemberRemove(guild, member) {
        let user = await _dbModels.User.findOne({ where: { userid: member.user.id } });
        if (user) {
            await user.update({ tokenDate: Date.now() });
            await this.createMessage('446010128484007936', `The tokens attributed to **${member.user.username}#${member.user.discriminator}** (${member.user.id}) have been invalidated due to them leaving the guild.`)
        }
    }
}

module.exports = DiscordClient;