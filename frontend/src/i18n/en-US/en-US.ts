import { TranslationType } from '../translationTypes';

const lang:TranslationType = {
  baseDialog: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    add: 'Add',
    edit: 'Adit',
  },
  validationMsg: {
    required: 'This field is required',
    positiveNumber: 'This field requires positive number',
    requireChars: 'This field require at least {chars} characters',
  },
  startPage: {
    title: 'Hello fellow!',
    subTitle: 'I\'m here to help you manage your munchkin game session. First tell me who you are',
    gameMasterButton: 'Game master',
    gameMasterDesc: 'Choose if you\'re the chosen one to manage stats of the munchkin session.',
    spectatorButton: 'Spectator',
    spectatorDesc: 'Choose if you\'re the spectator of the session.',
  },
  lobbyRoom: {
    title: 'So here we are as a spectator',
    description: `
    You're now in the lobby room.
    This is your unique QR Code. Game master need to scan it, to
    add you to game session. Make sure to increase the brightness of the screen,
    so the QR Code will be visible.
    `,
    leaveLobbyButton: 'Leave lobby',
  },
  playerTable: {
    title: 'Players',
    color: 'Color',
    isWoman: 'Sex',
    lvl: 'Level',
    gear: 'Gear',
    name: 'Name',
  },
  spectatorTable: {
    title: 'Spectators',
    fontSize: 'Font size',
    name: 'Name',
  },
  manageGame: {
    headerTitle: 'Munchkin session helper',
    addPlayerBtn: 'Add player',
    editPlayerBtn: 'Edit player',
    addSpectatorBtn: 'Add spectator',
    kickSpectator: 'Kick spectator',
    increaseText: 'Increase text',
    decreaseText: 'Decrease text',
    drawer: {
      prepareGame: 'Prepare game',
      runGame: 'Run game',
    },
  },
  playerDialog: {
    playerTitle: 'Player',
    nameField: 'Player name',
    colorField: 'Player color',
    woman: 'Woman',
    man: 'Man',
    deletedNotification: 'Player {name} deleted from session',
    addedNotification: 'Player: {name} added',
  },
  spectatorDialog: {
    title: 'Add spectator',
    spectatorName: 'Your own name for spectator',
    connectionStringBtn: 'ID connect',
    connectionString: 'Paste connection string from spectator',
    scanQRBtn: 'Scan QR Code',
    scanQR: 'Use camera to scan for QR Code on spectator monitor, to add them to your session',
  },
  gameSession: {
    lvl: 'LVL',
    gear: 'STRENGTH',
  },
};

export default lang;
