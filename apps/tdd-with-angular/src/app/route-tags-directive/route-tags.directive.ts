import {
  Directive,
  Input,
  OnInit,
  Optional,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// activateRoute = data: {}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[routeTags]' })
export class RouteTagsDirective implements OnInit {
  @Input() routeTags?: string;
  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    @Optional() private route?: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.routeTags) {
      this.vcr.createEmbeddedView(this.templateRef);
    }
    this.route?.data.subscribe((data) => {
      const routeTags = data['routeTags'];
      if (routeTags) {
        if (routeTags.includes(this.routeTags)) {
          this.vcr.createEmbeddedView(this.templateRef);
        } else {
          this.vcr.clear();
        }
      }
    });
  }
}
