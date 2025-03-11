import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";

interface GameImage {
  word: string;
  src: string;
}

interface LetterInfo {
  letter: string;
  count: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class HomePage {
  images: GameImage[] = [
    { word: 'SAN IGNACIO', src: 'assets/Ignacio.jpg' },
    { word: 'SAN FRANCISCO JAVIER', src: 'assets/javier.jpg' },
    { word: 'PEDRO FABRO', src: 'assets/pedro.jpg' },
    { word: 'ALONSO DE BARZANA', src: 'assets/alonso.jpg' },
  ];

  availableImages: GameImage[] = [...this.images];
  currentImage: GameImage = {} as GameImage;
  shuffledLetters: LetterInfo[] = [];
  selectedLetters: string[] = [];
  wordLength: number = 0;
  message = '';

  constructor() {
    this.nextRound();
  }

  nextRound(): void {
    if (this.availableImages.length === 0) {
      this.message = '🏆 ¡Has completado el juego!';
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.availableImages.length);
    this.currentImage = this.availableImages[randomIndex];
    this.availableImages.splice(randomIndex, 1);

    this.shuffledLetters = this.currentImage.word
      .split('')
      .filter((char: string) => char !== ' ')
      .sort(() => Math.random() - 0.5)
      .map(letter => ({ letter, count: 0 }));

    this.wordLength = this.currentImage.word.length;
    this.selectedLetters = this.currentImage.word
      .split('')
      .map((char: string) => char === ' ' ? ' ' : '');
    this.message = '';
  }

  selectLetter(letterInfo: LetterInfo): void {
    if (letterInfo.count >= 1) return;

    const firstEmptyIndex = this.selectedLetters.findIndex(l => l === '');
    if (firstEmptyIndex !== -1) {
      this.selectedLetters[firstEmptyIndex] = letterInfo.letter;
      letterInfo.count++;
    }
  }

  checkAnswer(): void {
    const userAnswer = this.selectedLetters.join('');
    if (userAnswer === this.currentImage.word) {
      this.message = '🎉 ¡Correcto!';
      setTimeout(() => this.nextRound(), 1000);
    } else {
      this.message = '❌ Incorrecto, intenta de nuevo.';
      this.selectedLetters = this.currentImage.word
        .split('')
        .map((char: string) => char === ' ' ? ' ' : '');
      this.shuffledLetters.forEach(letterInfo => letterInfo.count = 0);
    }
  }
  removeLastLetter(): void {
    const lastFilledIndex = this.selectedLetters.length - 1 - [...this.selectedLetters].reverse().findIndex(l => l !== '' && l !== ' ');
    if (lastFilledIndex >= 0) {
      const removedLetter = this.selectedLetters[lastFilledIndex];
      this.selectedLetters[lastFilledIndex] = '';

      // Find and update the count of the corresponding letter in shuffledLetters
      const letterInfo = this.shuffledLetters.find(l => l.letter === removedLetter);
      if (letterInfo) {
        letterInfo.count--;
      }
    }
  }
}
