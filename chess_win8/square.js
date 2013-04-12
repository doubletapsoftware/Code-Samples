/*

	This file has been pulled from the source code for Chess Pro for Windows 8.

	It contains the definition for instantiating Square objects
	which are used to represents positions on the chess board. The code
	handles drawing the pieces at their positions along with handling square highlights
	like available moves, past moves, and check indecators. The code also handles
	animations all while respecting the current game settings for piece styles.
	
	The code base uses arrays to reduce the need for if/else statements, for-loops, and
	unneccessary helper functions.
	
	
	By: Joe Hopkins
	
*/


/**
 * Function used to create a square object. One square represents one spot on the board.
 *
 * @param {integer} p Position on the board (E.G. 16)
 * @param {integer} t Type of piece (E.G. ChessTable.KKnight (2))
 *
*/
	
function Square(p, t) {
	this.pos = p;//position on the board, e.g. 35
	this.type = t;//type of piece, e.g. 2 (see ChessTable.KKnight)
	this.isSelected = false;//true if this square has been clicked
	this.isAvailableMove = false;//true if this square can be moved to
	this.isPreviousMove = false;//true if this square was the previous move
	this.canBeSelected = false;//true if this is a piece player can select



	/**
	 * Draws the square to the provided contexts based on its properties and whose turn it is.
	 *
	 * @param {context} context 2D Context for the HTML canvas element (used for pieces)
	 * @param {context} reflectionContext 2D Context for the HTML canvas element (used for piece reflections)
	 * @param {integer} currentPlayer Whose turn it is, black or white (ChessTable.KWhite: 0, ChessTable.KBlack: 1)
	 *
	*/
	this.draw = function (context, reflectionContext, currentPlayer) {
		
		var row = ChessTable.Rank[this.pos] - ChessTable.NumBlankRows;
		var column = ChessTable.File[this.pos] - ChessTable.NumBlankRows;

		if (MatchSettings.playAs === ChessTable.KWhite) {
			//flip board to face user
			row = ChessTable.numRows - row;
			column = ChessTable.numCols - column;
		}


		//set initial canvas coordinates
		var posX = column * ChessTable.SquareWidth + ChessTable.SquareMarginLeft;
		var posY = row * ChessTable.SquareHeight + ChessTable.SquareMarginTop;

		if (this.isPreviousMove) {
			//highlight to show the move that just happened
			context.drawImage(Images.highlight, posX, posY, ChessTable.SquareWidth, ChessTable.SquareHeight);
		}
		
		

		var pieceHasJustBeenMoved = this.pos === Game.pieceMovedTo;
		
		var pieceIsAnimated = false;//flag used to determine which context to draw to

		if (pieceHasJustBeenMoved) {
			//logic in this code block modifies the squares position 
			//for X number of frames in order to create animation effect
			
			
			Game.animationFrame++;

			if (Game.animationFrame >= GameConstants.NUM_ANIMATION_FRAMES) {
				//animation is done, do not modify coordinates for animating the move
			} else {
				//we need to animate
				pieceIsAnimated = true;

				//The engine removes any killed pieces immediatly so in order
				//to show the piece while animation is still happening we have to 
				//explicetly draw it here based on Game.pieceMoveToOriginalType.
				var killedPieceType = Game.pieceMoveToOriginalType;
				var killedPieceImage = getPieceImage(killedPieceType);
				var killedPieceReflectImage = getPieceReflectImage(killedPieceType);

				if (killedPieceImage !== null) {

					if (killedPieceReflectImage !== null) {
						
						var kpriX = posX + ChessTable.ReflectPlacementX[GameSettingOptions.pieceStyle];
						var kpriY = posY + ChessTable.ReflectPlacementY[GameSettingOptions.pieceStyle];
						
						//draw reflection
						reflectionContext.drawImage(killedPieceReflectImage, kpriX, kpriY);
					}
					
					var kpiX = posX + ChessTable.PiecePlacementX[GameSettingOptions.pieceStyle];
					var kpiY = posY + ChessTable.PiecePlacementY[GameSettingOptions.pieceStyle];
				
					//draw actual piece
					context.drawImage(killedPieceImage, kpiX, kpiY);
				}

				var originalRow = (ChessTable.Rank[Game.pieceMovedFrom] - ChessTable.NumBlankRows);
				var originalColumn = (ChessTable.File[Game.pieceMovedFrom] - ChessTable.NumBlankRows);
				
				if (MatchSettings.playAs === ChessTable.KWhite) {
					//flip board to face user
					row = ChessTable.numRows - row;
					column = ChessTable.numCols - column;
				}
				
				var originalPosX = (originalColumn * ChessTable.SquareWidth) + ChessTable.SquareMarginLeft;
				var originalPosY = (originalRow * ChessTable.SquareHeight) + ChessTable.SquareMarginTop;
				
				
				var distanceX = posX - originalPosX;
				var distanceY = posY - originalPosY;
				var distanceXStepSize = distanceX / GameConstants.NUM_ANIMATION_FRAMES;
				var distanceYStepSize = distanceY / GameConstants.NUM_ANIMATION_FRAMES;
				 
				//Increment posX and posY to create animation effect
				posX = originalPosX + (Game.animationFrame * distanceXStepSize);
				posY = originalPosY + (Game.animationFrame * distanceYStepSize);

			}
		}




		if (this.isSelected) {
			//draw selection highlight
			context.drawImage(Images.highlight, posX, posY, ChessTable.SquareWidth, ChessTable.SquareHeight);

		} else if ((this.type == ChessTable.KKing + currentPlayer) && GameEngine.getInCheck()) {
			//draw in check highlight
			context.drawImage(Images.highlightRed, posX, posY, ChessTable.SquareWidth, ChessTable.SquareHeight);

		}

		var pieceImage = getPieceImage(this.type);
		var reflectImage = getPieceReflectImage(this.type);

		if (pieceImage !== null) {
			if (this.isAvailableMove) {
				//draw available capture move highlight
			 	context.drawImage(Images.highlightDotBig, posX, posY);
			}	

			if (reflectImage !== null) {
				
				var riX = posX + ChessTable.ReflectPlacementX[GameSettingOptions.pieceStyle];
				var riY = posY + ChessTable.ReflectPlacementY[GameSettingOptions.pieceStyle];
				
			 	reflectionContext.drawImage(reflectImage, riX, riY);
			}


			var contextToDrawPiece = null;
			if (pieceIsAnimated) {
				contextToDrawPiece = Game.contextAnimated;
			} else {
				contextToDrawPiece = context;
			}

			var shouldFlipPiece = false;

			//only your pieces fliped
			if (MatchSettings.playAs == GameConstants.TWO_PLAYER
				&& GameSettingOptions.flipOpp == 1
				&& ChessTable.getIsPieceColor(this.type, ChessTable.KWhite)
				&& GameSettingOptions.pieceStyle != 0) {//pieceStyle 0 is the 3d set
			
				shouldFlipPiece = true;
			}

			if (shouldFlipPiece){
				contextToDrawPiece.save();
				contextToDrawPiece.translate(0, ScreenManager.GAME_BOARD_HEIGHT);
				contextToDrawPiece.scale(1, -1);
				posY = ChessTable.boardHeight - posY - ChessTable.SquareHeight;
			}

			var pieceX = posX + ChessTable.PiecePlacementX[GameSettingOptions.pieceStyle];
			var pieceY = posY + ChessTable.PiecePlacementY[GameSettingOptions.pieceStyle];

			contextToDrawPiece.drawImage(pieceImage, pieceX, pieceY);
		 
			if (shouldFlipPiece) {
				contextToDrawPiece.restore();
			}

		} else if (this.isAvailableMove) {
			//draw available move highlight
			context.drawImage(Images.highlightDot, posX, posY);
		}


	 };

	 
	/**
	 * Gets the image for a piece type (e.g. knight)
	 *
	 * @param {integer} type Deterimes what image is returned
	 *
	*/
	 function getPieceImage(type) {
	 	
		if (type >= ChessTable.KNullPiece) {
			return null;
		}
		return Images.pieceImages[type + GameConstants.pieceStyleArray[GameSettingOptions.pieceStyle]];
	 }

	/**
	 * Gets the reflection image for a piece type (e.g. knight's reflection)
	 *
	 * @param {integer} type Deterimes what image is returned
	 *
	*/
	 function getPieceReflectImage(type) {
	 	
		if (type >= ChessTable.KNullPiece) {
			return null;
		}
		return Images.pieceReflectImages[type + GameConstants.pieceStyleArray[GameSettingOptions.pieceStyle]];
	 }
}