'use strict';

import {
    GAME_BOARD_ID,
    PLAYING_FIELD_DIMENSION_ID,
    ROOT_ID,
    SETTINGS_FORM_ID,
    WINNING_STREAK_DIMENSION_ID,
} from "./src/constants/constants";
import {
    addListenerForChangeMaxWinStreak,
    addListenerForStartGame,
    initializeSettingsFormFromLocalStorage,
} from "./src/SettingsForm/SettingsForm";
import {getPlayerMoved, getGameBoardCells, markCell, toggleClassAndAttributeGameBoard} from "./src/gameBoard/gameBoard";

import './src/style.scss';
import {GAME_CELL, PLAYER_WALKS, GAMER_X, CELL_MARK, PLAYER_MARK} from "./src/consts";
import {PLAYER} from "./src/gameBoard/declaration/gameBoard";

{
    const rootElement = document.getElementById(ROOT_ID) as HTMLElement | null;
    const playingFieldDimension = document.getElementById(PLAYING_FIELD_DIMENSION_ID) as HTMLInputElement | null;
    const winningStreakDimension = document.getElementById(WINNING_STREAK_DIMENSION_ID) as HTMLInputElement | null;
    const settingsForm = document.getElementById(SETTINGS_FORM_ID) as HTMLFormElement | null;

    if (playingFieldDimension && winningStreakDimension) {
        initializeSettingsFormFromLocalStorage(playingFieldDimension, winningStreakDimension);
    } else {
        console.error('playingFieldDimension of winningStreakDimension is not defined!')
    }

    if (playingFieldDimension && winningStreakDimension) {
        addListenerForChangeMaxWinStreak(playingFieldDimension, winningStreakDimension);
    } else {
        console.error('playingFieldDimension or winningStreakDimension is not defined!');
    }

    if (settingsForm && playingFieldDimension && winningStreakDimension) {
        addListenerForStartGame(
            settingsForm,
            playingFieldDimension,
            winningStreakDimension,
        );
    } else {
        console.error('settingsForm or playingFieldDimension or winningStreakDimension is not defined!');
    }

    let gameBoard = document.getElementById(GAME_BOARD_ID) as HTMLElement | null;

    if (gameBoard) {
        gameBoard.remove();
    }

    gameBoard = document.createElement('div');

    gameBoard.setAttribute('id', GAME_BOARD_ID);
    gameBoard.setAttribute('class', `gameBoard gameBoardTable ${GAMER_X}`);
    gameBoard.setAttribute(PLAYER_WALKS, String(PLAYER.X));

    const gameBoardCellsArray = getGameBoardCells(9);

    for (const currentRow of gameBoardCellsArray) {
        const gameBoardRow = document.createElement('div');

        gameBoardRow.setAttribute('class', 'gameBoard__row');

        for (const currentCell of currentRow) {
            gameBoardRow.appendChild(currentCell);
        }

        gameBoard.appendChild(gameBoardRow);
    }

    gameBoard.addEventListener('click', function (event: MouseEvent) {
        const currentGameCell = (event.target as HTMLElement).closest(`.${GAME_CELL}`) as HTMLElement | null;
        const isCellClicked = !!(event.target as HTMLElement)?.getAttribute(PLAYER_MARK);
        const isMarkedCell = !!currentGameCell?.getAttribute(CELL_MARK);

        if (!isCellClicked || isMarkedCell) {
            return;
        }

        const movedPlayer: PLAYER = getPlayerMoved(this);

        if (currentGameCell) {
            markCell(currentGameCell, movedPlayer);
        } else {
            console.error('currentGameCell is not defined!')
        }

        toggleClassAndAttributeGameBoard(this);
    });

    if (rootElement) {
        rootElement.appendChild(gameBoard);
    }
    else {
        console.error('rootElement is not defined!');
    }
}