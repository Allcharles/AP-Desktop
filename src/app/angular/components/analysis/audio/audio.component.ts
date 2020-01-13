import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-audio",
  templateUrl: "./audio.component.html",
  styleUrls: ["./audio.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
