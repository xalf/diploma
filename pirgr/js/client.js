var figuresList = {};
(function($,undefined){
    var mouseDown = false;
    var shiftX = 0;
    var shiftY = 0;
    var startY = 0, startX = 0;
    var focusObj = null;
    
    function coords(e){
        var posx = 0;
        var posy = 0;
        if (e.pageX || e.pageY)     {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
        }

        return new Array(posx,posy);
    }
    function doSelection(x1,y1,x2,y2){
        focusObj = FigureCreators["composite"].factoryMethod(x1,y1,x2,y2);
        for(figure in figuresList){
            if(figuresList[figure].x > x1 && figuresList[figure].x < x2 && figuresList[figure].y > y1 && figuresList[figure].y < y2){
                focusObj.add(figuresList[figure]);
            }
        }
        focusObj.setFocus(true);
        focusObj.show();
    }
    
    $("#add-rectangle").click(function(e){
        e.preventDefault();
        var rect = FigureCreators["rectangle"].factoryMethod();
        figuresList[rect.id] = rect;
        rect.show();
    });
    $("#add-circle").click(function(e){
        e.preventDefault();
        var circle = FigureCreators["circle"].factoryMethod();
        figuresList[circle.id] = circle;
        circle.show();
    });
    $("#add-triangle").click(function(e){
        e.preventDefault();
        var tri = FigureCreators["triangle"].factoryMethod();
        figuresList[tri.id] = tri;
        tri.show();
    });
    $("#delete").click(function(e){
        e.preventDefault();
        if(focusObj !== null){
            if(figuresList[focusObj.id] !== undefined){
                focusObj.deleteR();
                delete figuresList[focusObj.id];
            }
            else{
                var m = focusObj.delete();
                for(i in m){
                    if(figuresList[m[i].id] !== undefined){
                        delete figuresList[m[i].id];
                        m[i].deleteR();
                    }
                }
            }
            focusObj = null;
        }
    });
    $("#clear").click(function(e){
        e.preventDefault();
        for(i in figuresList){
            figuresList[i].deleteR();
            delete figuresList[i];
        }
        if(focusObj !== null){
            focusObj.deleteR();
            focusObj = null;
        }
    });
    $("#group").click(function(e){
        e.preventDefault();
        if(focusObj !== null){
            figuresList[focusObj.id] = focusObj;
            for(i in focusObj.collection){
                if(figuresList[focusObj.collection[i].id] !== undefined){
                    delete figuresList[focusObj.collection[i].id];
                }
            }
            focusObj = null;
        }
    });
    $("#ungroup").click(function(e){
        e.preventDefault();
        if(focusObj !== null){
            var content = focusObj.delete();
            for(i in content){
                figuresList[content[i].id] = content[i];
                content[i].setFocus(false);
                content[i].show();
            }
            focusObj = null;
        }
    });
    $("#down").click(function(e){
        e.preventDefault();
        if(focusObj !== null){
            var z = parseInt(focusObj.htmlElm.css("z-index"));
            if(z === 0) return;
            focusObj.htmlElm.css("z-index",--z);
        }
    });
    $("#up").click(function(e){
        e.preventDefault();
        if(focusObj !== null){
            var z = parseInt(focusObj.htmlElm.css("z-index"));
            focusObj.htmlElm.css("z-index",++z);
        }
    });
    $("#getImg").click(function(e){
        e.preventDefault();
        var ajaxObj = new Array();

        for(i in figuresList){
            ajaxObj = ajaxObj.concat(figuresList[i].dataForImage(0,0));
        }

        ajaxObj = JSON.stringify(ajaxObj);
        console.log(ajaxObj);

         document.location = 'getimage.php?values=' + ajaxObj;
    });
    $("#objects-area")
		.on("mousedown", ".rectangle,.triangle,.circle,.composite", function(e){
			e.stopPropagation();
			if(focusObj !== null){
				focusObj.setFocus(false);
				if(focusObj.id != e.currentTarget.dataset.id && figuresList[focusObj.id] === undefined){
					focusObj.delete();
					focusObj = null;
				}
			} 
			if(figuresList[e.currentTarget.dataset.id] !== undefined && focusObj === null)
				focusObj = figuresList[e.currentTarget.dataset.id];
			else if(focusObj === null)
				return;

			focusObj.shiftX = e.pageX - e.currentTarget.getBoundingClientRect().left;
			focusObj.shiftY = e.pageY - e.currentTarget.getBoundingClientRect().top;
			focusObj.setFocus(true);
			focusObj.startMove();

			document.onmousemove = function(e) {
				focusObj.moveAt(e);
			};
			focusObj.htmlElm.ondragstart = function(){
				return false;
			}
			$("#objects-area").on("mouseup","div:not(#select-frame)",function(e){
				document.onmousemove = null;
				$("#objects-area").off("mouseup","div");
			});
    });
    $("#objects-area").on("mousedown",function(e){
        if(focusObj !== null){
            focusObj.setFocus(false);
            if(figuresList[focusObj.id] === undefined){
                focusObj.delete();
            }
            focusObj = null;
        }
        mouseDown = true;
        var mousexy = coords(e);
        startX = mousexy[0];
        startY = mousexy[1];

        document.onmousemove = function(e){
            var mousexy = coords(e);
            var x1 = startX;
            var y1 = startY;
            var x2 = mousexy[0];
            var y2 = mousexy[1];

            if (x1 == x2 || y1 == y2) return;
            if (x1 > x2){
                x1 = x1+x2;
                x2 = x1-x2;
                x1 = x1-x2;
            }
            if (y1 > y2){
                y1 = y1+y2;
                y2 = y1-y2;
                y1 = y1-y2;
            }

            var sframe = $("#select-frame");
            sframe.css("top",y1+"px");
            sframe.css("left",x1+"px");
            sframe.css("width",x2-x1+"px");
            sframe.css("height", y2-y1+"px");
            sframe.css("visibility", mouseDown?'visible':'hidden');
        };
        document.onmouseup = function(e){
            if (!e) var e = window.event;
            mouseDown = false;
            var mousexy = coords(e);
            var x1 = startX;
            var y1 = startY;
            var x2 = mousexy[0];
            var y2 = mousexy[1];

            if (x1 > x2){
                x1 = x1+x2;
                x2 = x1-x2;
                x1 = x1-x2;
            }
            if (y1 > y2){
                y1 = y1+y2;
                y2 = y1-y2;
                y1 = y1-y2;
            }

            if(x1 != x2 || y1 != y2)
                doSelection(x1,y1,x2,y2);
            document.getElementById('select-frame').style.visibility = mouseDown?'visible':'hidden';

            document.onmousemove = null;
            document.onmouseup = null;
        }

        return false;
    });
    $("#objects-area").on("mousedown",".r",function(e){
        e.preventDefault();
        e.stopPropagation();
        document.onmousemove = function(e){
            focusObj.resize({x2:e.pageX});
        }
        $("#objects-area").on("mouseup",".r",function(e){
            document.onmousemove = null;
        });
    });
    $("#objects-area").on("mousedown",".l",function(e){
        e.preventDefault();
        e.stopPropagation();
        document.onmousemove = function(e){
            focusObj.resize({x1:e.pageX});
        }
        $("#objects-area").on("mouseup",".l",function(e){
            document.onmousemove = null;
        });
    });
    $("#objects-area").on("mousedown",".t",function(e){
        e.preventDefault();
        e.stopPropagation();
        document.onmousemove = function(e){
            focusObj.resize({y1:e.pageY});
        }
        $("#objects-area").on("mouseup",".t",function(e){
            document.onmousemove = null;
        });
    });
    $("#objects-area").on("mousedown",".d",function(e){
        e.preventDefault();
        e.stopPropagation();
        document.onmousemove = function(e){
            focusObj.resize({y2:e.pageY});
        }
        $("#objects-area").on("mouseup",".d",function(e){
            document.onmousemove = null;
        });
    });
    $("#objects-area").on("mousedown",".tr",function(e){
        e.preventDefault();
        e.stopPropagation();
        document.onmousemove = function(e){
            focusObj.resize({x2:e.pageX,y1:e.pageY});
        }
        $("#objects-area").on("mouseup",".tr",function(e){
            document.onmousemove = null;
        });
    });
    $("#objects-area").on("mousedown",".tl",function(e){
        e.preventDefault();
        e.stopPropagation();
        document.onmousemove = function(e){
            focusObj.resize({x1:e.pageX,y1:e.pageY});
        }
        $("#objects-area").on("mouseup",".tl",function(e){
            document.onmousemove = null;
        });
    });
    $("#objects-area").on("mousedown",".dr",function(e){
        e.preventDefault();
        e.stopPropagation();
        document.onmousemove = function(e){
            focusObj.resize({x2:e.pageX,y2:e.pageY});
        }
        $("#objects-area").on("mouseup",".dr",function(e){
            document.onmousemove = null;
        });
    });
    $("#objects-area").on("mousedown",".dl",function(e){
        e.preventDefault();
        e.stopPropagation();
        document.onmousemove = function(e){
            focusObj.resize({x1:e.pageX,y2:e.pageY});
        }
        $("#objects-area").on("mouseup",".dl",function(e){
            document.onmousemove = null;
        });
    });
    
})(jQuery);