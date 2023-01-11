export type TranslationType = {
  baseDialog: {
    save: string,
    cancel: string,
    close: string,
    delete: string,
    add: string,
    edit: string,
  },
  validationMsg: {
    required: string,
    positiveNumber: string,
    requireChars: string,
  },
  startPage: {
    title: string,
    subTitle: string,
    gameMasterButton: string,
    gameMasterDesc: string,
    spectatorButton: string,
    spectatorDesc: string,
  },
  lobbyRoom: {
    title: string,
    description: string,
    leaveLobbyButton: string,
  },
  playerTable: {
    title: string,
    color: string,
    isWoman: string,
    lvl: string,
    gear: string,
    name: string,
  },
  spectatorTable: {
    title: string,
    fontSize: string,
    name: string,
  },
  manageGame: {
    headerTitle: string,
    addPlayerBtn: string,
    editPlayerBtn: string,
    addSpectatorBtn: string,
    kickSpectator: string,
    increaseText: string,
    decreaseText: string,
    drawer: {
      prepareGame: string,
      runGame: string,
    }
  },
  playerDialog: {
    playerTitle: string,
    nameField: string,
    colorField: string,
    woman: string,
    man: string,
    deletedNotification: string,
    addedNotification: string,
  },
  spectatorDialog: {
    title: string,
    spectatorName: string,
    connectionStringBtn: string,
    connectionString: string,
    scanQRBtn: string,
    scanQR: string,
  },
  gameSession: {
    lvl: string,
    gear: string,
  }
}
