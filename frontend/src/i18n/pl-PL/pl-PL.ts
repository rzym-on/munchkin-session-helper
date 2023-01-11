import { TranslationType } from '../translationTypes';

const lang:TranslationType = {
  baseDialog: {
    save: 'Zapisz',
    cancel: 'Anuluj',
    close: 'Zamknij',
    delete: 'Usuń',
    add: 'Dodaj',
    edit: 'Edytuj',
  },
  validationMsg: {
    required: 'To pole jest wymagane',
    positiveNumber: 'To pole wymaga dodatniej liczby',
    requireChars: 'To pole wymaga conajmniej {chars} znaków',
  },
  startPage: {
    title: 'Witaj przyjacielu!',
    subTitle: 'Jestem tu, żeby pomóc Ci poprowadzić sesję munchkina. Najpierw powiedz mi kim jesteś',
    gameMasterButton: 'Mistrz gry',
    gameMasterDesc: 'Kliknij, jeśli jesteś wybrańcem i to Ty masz dbać o statystyki w grze',
    spectatorButton: 'Widz',
    spectatorDesc: 'Kliknij jeśli jesteś telewizorem, rzutnikiem albo jednym z graczy oglądających sesję',
  },
  lobbyRoom: {
    title: 'A więc jesteś widzem',
    description: `
    Jesteś teraz w poczekalni (lobby room). To jest twój unikalny kod QR.
    Mistrz gry musi go zeskanować, aby dodać Cię do sesji gry. Pamiętaj o zwiększeniu jasności ekranu, żeby kod QR był widoczny.
    `,
    leaveLobbyButton: 'Wyjdź z lobby',
  },
  playerTable: {
    title: 'Gracze',
    color: 'Kolor',
    isWoman: 'Płeć',
    lvl: 'Poziom',
    gear: 'Siła',
    name: 'Nazwa',
  },
  spectatorTable: {
    title: 'Widzowie',
    fontSize: 'Rozmiar tekstu',
    name: 'Nazwa',
  },
  manageGame: {
    headerTitle: 'Munchkin menedżer sesji',
    addPlayerBtn: 'Dodaj gracza',
    editPlayerBtn: 'Edytuj gracza',
    addSpectatorBtn: 'Dodaj widza',
    kickSpectator: 'Usuń widza',
    increaseText: 'Zwiększ tekst',
    decreaseText: 'Zmniejsz tekst',
    drawer: {
      prepareGame: 'Przygotowanie sesji',
      runGame: 'Przebieg sesji',
    },
  },
  playerDialog: {
    playerTitle: 'Gracza',
    nameField: 'Nazwa gracze',
    colorField: 'Kolor gracza',
    woman: 'Kobieta',
    man: 'Mężczyzna',
    deletedNotification: 'Gracz {name} został usunięty z gry',
    addedNotification: 'Gracz {name} dodany do gry',
  },
  spectatorDialog: {
    title: 'Dodaj widza',
    spectatorName: 'Twoja własna nazwa widza',
    connectionStringBtn: 'Identyfikator',
    connectionString: 'Wklej identyfikator połączenia widza',
    scanQRBtn: 'Zeskanuj kod QR',
    scanQR: 'Za pomocą kamery zeskanuj kod QR na urządzeniu widza, żeby dołączyć go do sesji',
  },
  gameSession: {
    lvl: 'LVL',
    gear: 'SIŁA',
  },
};

export default lang;
