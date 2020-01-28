import { TestBed } from "@angular/core/testing";
import { APService } from "./ap.service";

describe("APService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: APService = TestBed.get(APService);
    expect(service).toBeTruthy();
  });
});
