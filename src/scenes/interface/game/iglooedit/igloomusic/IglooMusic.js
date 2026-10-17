import BaseContainer from '@scenes/base/BaseContainer'

import { Button, Interactive } from '@components/components'

import MusicItem from './music_item/MusicItem'


/* START OF COMPILED CODE */

export default class IglooMusic extends BaseContainer {

    constructor(scene, x, y) {
        super(scene, x ?? 760, y ?? 480);

        // block
        const block = scene.add.rectangle(0, 0, 1520, 960);
        block.isFilled = true;
        block.fillColor = 0;
        block.fillAlpha = 0.2;
        this.add(block);

        // music_bg
        const music_bg = scene.add.image(0, -24, "iglooedit", "music_bg");
        this.add(music_bg);

        // blueButton
        const blueButton = scene.add.image(338, -275, "main", "blue-button");
        this.add(blueButton);

        // blueX
        const blueX = scene.add.image(338, -277, "main", "blue-x");
        this.add(blueX);

        // title
        const title = scene.add.text(0, -297, "", {});
        title.setOrigin(0.5, 0);
        title.text = "Lista de Músicas";
        title.setStyle({ "align": "center", "color": "#000", "fixedWidth":600,"fontFamily": "Arial Narrow", "fontSize": "32px" });
        this.add(title);

        // musicItem
        const musicItem = new MusicItem(scene, -179, -210);
        this.add(musicItem);

        // musicItem_1
        const musicItem_1 = new MusicItem(scene, -179, -154);
        this.add(musicItem_1);

        // musicItem_2
        const musicItem_2 = new MusicItem(scene, -179, -98);
        this.add(musicItem_2);

        // musicItem_3
        const musicItem_3 = new MusicItem(scene, -179, -42);
        this.add(musicItem_3);

        // musicItem_4
        const musicItem_4 = new MusicItem(scene, -179, 14);
        this.add(musicItem_4);

        // musicItem_5
        const musicItem_5 = new MusicItem(scene, -179, 70);
        this.add(musicItem_5);

        // musicItem_6
        const musicItem_6 = new MusicItem(scene, -179, 126);
        this.add(musicItem_6);

        // musicItem_7
        const musicItem_7 = new MusicItem(scene, 177, -210);
        this.add(musicItem_7);

        // musicItem_8
        const musicItem_8 = new MusicItem(scene, 177, -154);
        this.add(musicItem_8);

        // musicItem_9
        const musicItem_9 = new MusicItem(scene, 177, -98);
        this.add(musicItem_9);

        // musicItem_10
        const musicItem_10 = new MusicItem(scene, 177, -42);
        this.add(musicItem_10);

        // musicItem_11
        const musicItem_11 = new MusicItem(scene, 177, 14);
        this.add(musicItem_11);

        // musicItem_12
        const musicItem_12 = new MusicItem(scene, 177, 70);
        this.add(musicItem_12);

        // musicItem_13
        const musicItem_13 = new MusicItem(scene, 177, 126);
        this.add(musicItem_13);

        // musicItem_14
        const musicItem_14 = new MusicItem(scene, -179, 220);
        this.add(musicItem_14);

        // block (components)
        new Interactive(block);

        // blueButton (components)
        const blueButtonButton = new Button(blueButton);
        blueButtonButton.spriteName = "blue-button";
        blueButtonButton.callback = () => this.visible = false;

        // musicItem (prefab fields)
        musicItem.name = "Laboratório do Puffle Marrom";
        musicItem.musicId = 305;
        musicItem.bold = false;

        // musicItem_1 (prefab fields)
        musicItem_1.name = "Cuidado com o Dragão";
        musicItem_1.musicId = 286;
        musicItem_1.bold = true;

        // musicItem_2 (prefab fields)
        musicItem_2.name = "Planeta Y";
        musicItem_2.musicId = 38;
        musicItem_2.bold = false;

        // musicItem_3 (prefab fields)
        musicItem_3.name = "Rock Pré-Histórico";
        musicItem_3.musicId = 35;
        musicItem_3.bold = false;

        // musicItem_4 (prefab fields)
        musicItem_4.name = "A Corte Real";
        musicItem_4.musicId = 233;
        musicItem_4.bold = true;

        // musicItem_5 (prefab fields)
        musicItem_5.name = "Festa dos Puffles";
        musicItem_5.musicId = 259;
        musicItem_5.bold = false;

        // musicItem_6 (prefab fields)
        musicItem_6.name = "Na Torre";
        musicItem_6.musicId = 235;
        musicItem_6.bold = false;

        // musicItem_7 (prefab fields)
        musicItem_7.name = "Ataque Normando";
        musicItem_7.musicId = 42;
        musicItem_7.bold = false;

        // musicItem_8 (prefab fields)
        musicItem_8.name = "À Batalha!";
        musicItem_8.musicId = 236;
        musicItem_8.bold = true;

        // musicItem_9 (prefab fields)
        musicItem_9.name = "Dança das Nadadeiras";
        musicItem_9.musicId = 263;
        musicItem_9.bold = false;

        // musicItem_10 (prefab fields)
        musicItem_10.name = "Serenata Gelada";
        musicItem_10.musicId = 256;
        musicItem_10.bold = true;

        // musicItem_11 (prefab fields)
        musicItem_11.name = "O Caminho do Sensei";
        musicItem_11.musicId = 24;
        musicItem_11.bold = false;

        // musicItem_12 (prefab fields)
        musicItem_12.name = "Resgate de Puffles: Na Caverna";
        musicItem_12.musicId = 120;
        musicItem_12.bold = false;

        // musicItem_13 (prefab fields)
        musicItem_13.name = "Pela Grande Justiça";
        musicItem_13.musicId = 32;
        musicItem_13.bold = false;

        // musicItem_14 (prefab fields)
        musicItem_14.name = "Sem Música";
        musicItem_14.musicId = 0;
        musicItem_14.bold = false;

        /* START-USER-CTR-CODE */
        /* END-USER-CTR-CODE */
    }

    /* START-USER-CODE */
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */
