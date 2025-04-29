import { Component, OnInit } from '@angular/core';
import { MeetingService } from 'src/app/front-office/services/meeting.service';

@Component({
  selector: 'app-slot-selector',
  templateUrl: './slot-selector.component.html',
  styleUrls: ['./slot-selector.component.css']
})
export class SlotSelectorComponent implements OnInit {
  selectedDate: string = '';
  selectedSlot: string | null = null;

  slots: { time: string; available: boolean }[] = [];

  ngOnInit(): void {
    this.generateSlots(); // charge les créneaux à l'affichage
  }

  onDateChange(): void {
    // ici tu peux ajouter une logique pour charger depuis le backend
    this.generateSlots(); // pour l'instant on recharge des faux créneaux
  }

  generateSlots(): void {
    const startHour = 9;
    const endHour = 17;
    const slotDuration = 30; // minutes

    const generatedSlots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const slot1 = `${this.pad(hour)}:00 - ${this.pad(hour)}:30`;
      const slot2 = `${this.pad(hour)}:30 - ${this.pad(hour + 1)}:00`;
      generatedSlots.push({ time: slot1, available: Math.random() > 0.3 });
      generatedSlots.push({ time: slot2, available: Math.random() > 0.3 });
    }

    this.slots = generatedSlots;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  selectSlot(time: string): void {
    this.selectedSlot = time;
  }
}

