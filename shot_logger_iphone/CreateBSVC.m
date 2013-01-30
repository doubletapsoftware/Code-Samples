/*
 
 This file is pulled from the source code 
 for the iPhone app: Basketball Shot Logger.
 
 It contains the code used to handle the
 functionality of adding shots to the 
 court diagram (see screenshot).
 
 
 */



//
//  CreateBSVC.m
//  Basketball Shot Logger
//
//  Created by Joe Hopkins on 5/3/12.
//  Copyright (c) 2012 __DoubleTap Software__. All rights reserved.
//

#import "CreateBSVC.h"
#import "Marker.h"
#import "BoxScore.h"
#import "History.h"

@implementation CreateBSVC

NSMutableArray *markers;
BoxScore *boxScore;
MarkerType currentMarkerType;
History *history;


- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    
    if (self) {
        // Custom initialization
    }
    
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    // Additional setup after loading the view from its nib.
    
    UIButton *courtDiagram = (UIButton *)[self.view viewWithTag:1];
    
    [courtDiagram addTarget:self action:@selector(placeMarker:withEvent: ) forControlEvents: UIControlEventTouchDown];
    
    boxScore = [[BoxScore alloc] init];
    markers = [[NSMutableArray alloc] init];
    
    currentMarkerType = (MarkerType) miss;
    
}

- (void) placeMarker: (UIControl *) c withEvent:ev
{
    Marker* marker = [[Marker alloc] init];
    marker.type = currentMarkerType;
    
    CGPoint location = [[[ev allTouches] anyObject] locationInView:self.view];
    
    marker.button = [self createMarkerButton: location ];
    
    [self.view addSubview: marker.button];
    
    
    [markers addObject:marker];
    
}

- (UIButton*) createMarkerButton: (CGPoint) location
{
    
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    button.frame = CGRectMake(0, 0, 25, 25);
    
    if (currentMarkerType == (MarkerType) miss){
        [button setBackgroundImage:[UIImage imageNamed:@"missedShot.jpeg"] forState:UIControlStateNormal];
    } else if (currentMarkerType == (MarkerType) make){
        [button setBackgroundImage:[UIImage imageNamed:@"madeShot.png"] forState:UIControlStateNormal];
    }
    
    button.center = location;
    
    
    //add events to enable dragging
    [button addTarget:self action:@selector(dragMarker:withEvent: ) forControlEvents: UIControlEventTouchDragInside];
    [button addTarget:self action:@selector(dragMarkerFinished:withEvent: ) forControlEvents:UIControlEventTouchUpInside | UIControlEventTouchUpOutside];
    
    
    
    return button;    
}

- (void) dragMarker: (UIControl *) c withEvent:ev
{
    c.center = [[[ev allTouches] anyObject] locationInView:self.view];
}

- (void) dragMarkerFinished: (UIControl *) c withEvent:ev
{
    c.center = [[[ev allTouches] anyObject] locationInView:self.view];
}

- (IBAction)CancelButton:(UIBarButtonItem *)sender {
    
    [self dismissModalViewControllerAnimated:TRUE];
}

- (IBAction)MarkerTypeSegmentControl:(UISegmentedControl *)sender forEvent:(UIEvent *)event {
    
    if (sender.selectedSegmentIndex == 0){
        currentMarkerType = (MarkerType) miss;
    } else if (sender.selectedSegmentIndex == 1){
        currentMarkerType = (MarkerType) make;
    }
}

- (IBAction)SaveBoxScoreButton:(UIBarButtonItem *)sender {

    boxScore.markers = markers;
    
    history = [[History alloc] init];
    
    [history addBoxScore:boxScore];
    
    [self dismissModalViewControllerAnimated:TRUE];
}

- (void)viewDidUnload
{
    // Release any retained subviews of the main view.
    
    [super viewDidUnload];    
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}

@end
