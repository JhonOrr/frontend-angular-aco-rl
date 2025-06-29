import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteVisualizationComponent } from './route-visualization.component';

describe('RouteVisualizationComponent', () => {
  let component: RouteVisualizationComponent;
  let fixture: ComponentFixture<RouteVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
