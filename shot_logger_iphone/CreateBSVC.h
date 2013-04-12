//
//  CreateBSVC.h
//  Personal Box Score
//
//  Created by Joe Hopkins on 5/3/12.
//  Copyright (c) 2012 __DoubleTap Software__. All rights reserved.
//

#import <UIKit/UIKit.h>


//This view controller is used to display a basketball court diagram 
//that allows the user to enter locations for made and missed shots
//in order to create a boxscore.
@interface CreateBSVC : UIViewController {
    NSMutableArray *markers;
    BoxScore *boxScore;
    MarkerType currentMarkerType;
    History *history;
}

@end