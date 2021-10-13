import { ActivatedRoute } from '@angular/router';
import { screen, render } from '@testing-library/angular';
import { BehaviorSubject, of } from 'rxjs';

import { RouteTagsDirective } from './route-tags.directive';

describe(RouteTagsDirective.name, () => {
  it('should show the content if the tag is not specified', async () => {
    await render(`<div *routeTags data-testid="routeTags">This works!</div>`, {
      declarations: [RouteTagsDirective],
    });

    expect(screen.queryByTestId('routeTags')).toBeInTheDocument();
  });

  it('should NOT show the content if the tag is provided and the data in the route is undefined', async () => {
    await render(
      `<div *routeTags="'imNotPresent'" data-testid="routeTags">This works!</div>`,
      {
        declarations: [RouteTagsDirective],
      }
    );

    expect(screen.queryByTestId('routeTags')).not.toBeInTheDocument();
  });

  it('should HIDE the content if the tag is provided and the data in the route does NOT contains the tag', async () => {
    await render(
      `<div *routeTags="'notShowME'" data-testid="routeTags">This works!</div>`,
      {
        declarations: [RouteTagsDirective],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ routeTags: ['showME'] }) },
          },
        ],
      }
    );

    expect(screen.queryByTestId('routeTags')).not.toBeInTheDocument();
  });

  it('should SHOW the content if the tag is provided and the data in the route does contains the tag', async () => {
    await render(
      `<div *routeTags="'showME'" data-testid="routeTags">This works!</div>`,
      {
        declarations: [RouteTagsDirective],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ routeTags: ['showME'] }) },
          },
        ],
      }
    );

    expect(screen.queryByTestId('routeTags')).toBeInTheDocument();
  });

  it('should HIDE the content if the tag is provided and the data in the is empty', async () => {
    await render(
      `<div *routeTags="'showME'" data-testid="routeTags">This works!</div>`,
      {
        declarations: [RouteTagsDirective],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({}) },
          },
        ],
      }
    );

    expect(screen.queryByTestId('routeTags')).not.toBeInTheDocument();
  });

  it('should HIDE the content if the tag is provided and the route changes to not having the tag in the data', async () => {
    const dataSubject = new BehaviorSubject<any>({ routeTags: ['showME'] });

    const fixture = await render(
      `<div *routeTags="'showME'" data-testid="routeTags">This works!</div>`,
      {
        declarations: [RouteTagsDirective],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: dataSubject.asObservable() },
          },
        ],
      }
    );

    expect(screen.queryByTestId('routeTags')).toBeInTheDocument();

    dataSubject.next({ routeTags: ['NotshowME'] });

    fixture.detectChanges();

    expect(screen.queryByTestId('routeTags')).not.toBeInTheDocument();
  });

});
