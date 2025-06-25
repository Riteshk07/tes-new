import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export interface BreakpointState {
  isHandset: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  orientation: 'portrait' | 'landscape';
}

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private breakpointStateSubject = new BehaviorSubject<BreakpointState>({
    isHandset: false,
    isTablet: false,
    isDesktop: true,
    isLarge: false,
    orientation: 'landscape'
  });

  public breakpointState$ = this.breakpointStateSubject.asObservable();

  isHandset$!: Observable<boolean>;
  isTablet$!: Observable<boolean>;
  isDesktop$!: Observable<boolean>;
  isLarge$!: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.initializeObservables();
    this.initializeBreakpointObserver();
  }

  private initializeObservables(): void {
    this.isHandset$ = this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape
    ]).pipe(
      map(result => result.matches),
      shareReplay()
    );

    this.isTablet$ = this.breakpointObserver.observe([
      Breakpoints.Tablet,
      Breakpoints.TabletPortrait,
      Breakpoints.TabletLandscape
    ]).pipe(
      map(result => result.matches),
      shareReplay()
    );

    this.isDesktop$ = this.breakpointObserver.observe([
      Breakpoints.Web,
      Breakpoints.WebPortrait,
      Breakpoints.WebLandscape
    ]).pipe(
      map(result => result.matches),
      shareReplay()
    );

    this.isLarge$ = this.breakpointObserver.observe([
      Breakpoints.XLarge
    ]).pipe(
      map(result => result.matches),
      shareReplay()
    );
  }

  private initializeBreakpointObserver(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web,
      Breakpoints.XLarge
    ]).subscribe(() => {
      this.updateBreakpointState();
    });

    // Also observe orientation changes
    this.breakpointObserver.observe([
      '(orientation: portrait)',
      '(orientation: landscape)'
    ]).subscribe(() => {
      this.updateBreakpointState();
    });
  }

  private updateBreakpointState(): void {
    const isHandset = this.breakpointObserver.isMatched([
      Breakpoints.Handset,
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape
    ]);

    const isTablet = this.breakpointObserver.isMatched([
      Breakpoints.Tablet,
      Breakpoints.TabletPortrait,
      Breakpoints.TabletLandscape
    ]);

    const isDesktop = this.breakpointObserver.isMatched([
      Breakpoints.Web,
      Breakpoints.WebPortrait,
      Breakpoints.WebLandscape
    ]);

    const isLarge = this.breakpointObserver.isMatched([
      Breakpoints.XLarge
    ]);

    const orientation = this.breakpointObserver.isMatched('(orientation: portrait)') 
      ? 'portrait' : 'landscape';

    const newState: BreakpointState = {
      isHandset,
      isTablet,
      isDesktop,
      isLarge,
      orientation
    };

    this.breakpointStateSubject.next(newState);
  }

  getCurrentBreakpoint(): BreakpointState {
    return this.breakpointStateSubject.value;
  }

  isMobile(): boolean {
    return this.getCurrentBreakpoint().isHandset;
  }

  isTablet(): boolean {
    return this.getCurrentBreakpoint().isTablet;
  }

  isDesktop(): boolean {
    return this.getCurrentBreakpoint().isDesktop || this.getCurrentBreakpoint().isLarge;
  }

  getColumnsForBreakpoint(): number {
    const state = this.getCurrentBreakpoint();
    if (state.isHandset) return 1;
    if (state.isTablet) return 2;
    if (state.isDesktop) return 3;
    if (state.isLarge) return 4;
    return 3;
  }

  getCardSizeForBreakpoint(): 'small' | 'medium' | 'large' {
    const state = this.getCurrentBreakpoint();
    if (state.isHandset) return 'small';
    if (state.isTablet) return 'medium';
    return 'large';
  }
}