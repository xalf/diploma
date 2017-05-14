var randomMethods = {
    getRandom: function(){
        return parseInt(Math.random()*1000)+(+new Date());
    },
    getRandomColor: function(){
        return "#" + this.getRandomArbitary(50,255).toString(16)+ this.getRandomArbitary(50,255).toString(16)+ this.getRandomArbitary(50,255).toString(16);
    },
    getRandomArbitary: function(min, max)
    {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }  
};

var FigureCreators = (function(){
    function setShell(element){
        var shell = $(document.createElement("div"));
        shell.append(element);
        
        var l = $(document.createElement("div"));
        l.addClass("l");
        shell.append(l);
        
        var r = $(document.createElement("div"));
        r.addClass("r");
        shell.append(r);
        
        var t = $(document.createElement("div"));
        t.addClass("t");
        shell.append(t);
        
        var d = $(document.createElement("div"));
        d.addClass("d");
        shell.append(d);
        
        var tl = $(document.createElement("div"));
        tl.addClass("tl");
        shell.append(tl);
        
        var tr = $(document.createElement("div"));
        tr.addClass("tr");
        shell.append(tr);
        
        var dl = $(document.createElement("div"));
        dl.addClass("dl");
        shell.append(dl);
        
        var dr = $(document.createElement("div"));
        dr.addClass("dr");
        shell.append(dr);
        
        return shell;
    }
    
    function Figure() {
        this.show = function(context){
            if(context !== undefined){
                this.parent = context;
            }
            else{
                if(this.parent === null)
                    this.parent = $("#objects-area");
            }
            this.htmlElm.detach();
            this.parent.append(this.htmlElm);
            for(figure in this.collection){
                this.collection[figure].show(this.htmlElm);
            }
        }
        this.setXY = function(){
            this.htmlElm.css("left", this.x + 'px');
            this.htmlElm.css("top", this.y + 'px');
        }
        this.delete= function(){
            var returnObj = {};
            this.htmlElm.detach();
            for(i in this.collection){
                var figure = this.collection[i];
                this.collection[i].x += this.x;
                this.collection[i].y += this.y;
                this.collection[i].setXY();
                returnObj[this.collection[i].id] = this.collection[i];
                this.collection[i].show(this.parent);
            }
            return returnObj;
        }
        this.deleteR= function(){
            this.htmlElm.detach();
            for(i in this.collection){
                this.collection[i].deleteR();
            }
        }
        this.moveAt = function(e) {
            this.x = e.pageX - this.shiftX;
            this.y = e.pageY - this.shiftY;
            this.setXY();
        }
        this.setFocus = function(flag){
            if(flag){
                this.htmlElm.addClass("focus-figure");
                for(figure in this.collection){
                    this.collection[figure].setFocus(flag);
                }
            }
            else{
                this.htmlElm.removeClass("focus-figure");
                for(figure in this.collection){
                    this.collection[figure].setFocus(flag);
                }
            }
        }
        this.add = function(figure){};
        this.startMove = function(){
            for(figure in this.collection){
                this.collection[figure].shiftX = 0;
                this.collection[figure].shiftY = 0;
                this.collection[figure].startMove();
            }
        }
        this.resize = function(obj){
            if(obj.x2 !== undefined && obj.x2 > this.x){
                this.width = obj.x2 - this.x;
                this.htmlElm.css("width",this.width);
            }
            if(obj.x1 !== undefined && obj.x1 < this.x + this.width){
                this.width += this.x - obj.x1; 
                this.x = obj.x1;
                this.htmlElm.css("left",this.x);
                this.htmlElm.css("width",this.width);
            }
            if(obj.y2 !== undefined && obj.y2 > this.y){
                this.height = obj.y2 - this.y;
                this.htmlElm.css("height",this.height);
            }
            if(obj.y1 !== undefined && obj.y1 < this.y + this.height){
                this.height += this.y - obj.y1;
                this.y = obj.y1;
                this.htmlElm.css("height",this.height);
                this.htmlElm.css("top",this.y);
            }
        }
        this.dataForImage = function(parentX,parentY){
            var dataArray = new Array();
            var data = {};
            
            data["x"] = this.x + parentX;
            data["y"] = this.y + parentY;
            data["type"] = this.htmlElm[0].className.split(" ")[0];
            data["width"] = this.width;
            data["height"] = this.height;
            data["color"] = this.getColor();
            dataArray.push(data);
            
            return dataArray;
        }
        this.getColor = function(){
            var mc = this.htmlElm.children(".fig").css("background-color").match(/\d+/g);
            return {
                r: mc[0],
                g: mc[1],
                b: mc[2]
            };
        }
    }
 
    function Rectangle(){
        this.x = 0;
        this.y = 0;
        this.height = 60;
        this.width = 100;
        this.shiftX = 0;
        this.shiftY = 0;
        this.parent = null;
        this.id = randomMethods.getRandom();
        this.htmlElm = $(document.createElement("div"));
        this.htmlElm.addClass("fig");
        this.htmlElm.css("background-color",randomMethods.getRandomColor());
        this.htmlElm = setShell(this.htmlElm);
        this.htmlElm.addClass("rectangle");
        this.htmlElm.css("height", this.height);
        this.htmlElm.css("width", this.width);
        this.htmlElm.attr("data-id",this.id);
        this.collection = {};
    }
    Rectangle.prototype = new Figure();
    Rectangle.prototype.constructor = Rectangle;
    
    function Circle(){
        this.x = 0;
        this.y = 0;
        this.height = 60;
        this.width = 60;
        this.shiftX = 0;
        this.shiftY = 0;
        this.parent = null;
        this.id = randomMethods.getRandom();
        this.htmlElm = $(document.createElement("div"));
        this.htmlElm.addClass("fig");
        this.htmlElm.css("background-color",randomMethods.getRandomColor());
        this.htmlElm = setShell(this.htmlElm);
        this.htmlElm.addClass("circle");
        this.htmlElm.css("height", this.height);
        this.htmlElm.css("width", this.width);
        this.htmlElm.attr("data-id",this.id);
        this.collection = {};
    }
    Circle.prototype = new Figure();
    Circle.prototype.constructor = Circle;

    function Triangle() {
        this.x = 0;
        this.y = 0;
        this.shiftX = 0;
        this.shiftY = 0;
        this.height = 60;
        this.width = 60;
        this.parent = null;
        this.id = randomMethods.getRandom();
        this.htmlElm = $(document.createElement("div"));
        this.htmlElm.addClass("fig");
        this.htmlElm.css("border-bottom-color",randomMethods.getRandomColor());
        this.htmlElm.css("border-bottom-width",this.height);
        this.htmlElm.css("border-left-width",this.width/2);
        this.htmlElm.css("border-right-width",this.width/2);
        this.htmlElm = setShell(this.htmlElm);
        this.htmlElm.addClass("triangle");
        this.htmlElm.css("height", this.height);
        this.htmlElm.css("width", this.width);
        this.htmlElm.attr("data-id",this.id);
        this.collection = {};
        this.resize = function(obj){
            if(obj.x2 !== undefined && obj.x2 > this.x){
                this.width = obj.x2 - this.x;
                this.htmlElm.css("width",this.width);
                var fig = this.htmlElm.children(".fig");
                fig.css("border-right-width",this.width/2);
                fig.css("border-left-width",this.width/2);
            }
            if(obj.x1 !== undefined && obj.x1 < this.x + this.width){
                this.width += this.x - obj.x1; 
                this.x = obj.x1;
                this.htmlElm.css("left",this.x);
                this.htmlElm.css("width",this.width);
                var fig = this.htmlElm.children(".fig");
                fig.css("border-right-width",this.width/2);
                fig.css("border-left-width",this.width/2);
            }
            if(obj.y2 !== undefined && obj.y2 > this.y){
                this.height = obj.y2 - this.y;
                this.htmlElm.css("height",this.height);
                var fig = this.htmlElm.children(".fig");
                fig.css("border-bottom-width",this.height);
            }
            if(obj.y1 !== undefined && obj.y1 < this.y + this.height){
                this.height += this.y - obj.y1;
                this.y = obj.y1;
                this.htmlElm.css("height",this.height);
                this.htmlElm.css("top",this.y);
                var fig = this.htmlElm.children(".fig");
                fig.css("border-bottom-width",this.height);
            }
        }
        this.getColor = function(){
            var mc = this.htmlElm.children(".fig").css("border-bottom-color").match(/\d+/g);
            return {
                r: mc[0],
                g: mc[1],
                b: mc[2]
            }
        }
    }
    Triangle.prototype = new Figure();
    Triangle.prototype.constructor = Triangle;
    
    function Composite(x1,y1,x2,y2){
        this.x = x1;
        this.y = y1;
        this.height = y2 - y1;
        this.width = x2 - x1;
        this.shiftX = 0;
        this.shiftY = 0;
        this.parent = null;
        this.id = randomMethods.getRandom();
        this.htmlElm = $(document.createElement("div"));
        this.htmlElm.addClass("composite");
        this.htmlElm.attr("data-id",this.id);
        this.htmlElm.css("left",this.x+"px");
        this.htmlElm.css("top",this.y+"px");
        this.htmlElm.css("width",this.width+"px");
        this.htmlElm.css("height",this.height+"px");
        this.collection = {};
        this.add = function(figure){
            figure.x -= this.x;
            figure.y -= this.y;
            figure.setXY();
            this.collection[figure.id] = figure;
        };
        this.resize = function(){};
        this.dataForImage = function(parentX, parentY){
            var dataArray = new Array();
            
            for(i in this.collection){
                dataArray = dataArray.concat(this.collection[i].dataForImage(this.x+parentX, this.y+parentY));
            }
            
            return dataArray;
        }
    }
    Composite.prototype = new Figure();
    Composite.prototype.constructor = Composite;

    function FigureCreator() {this.factoryMethod=null;}

    function RectangleCreator() {
        this.factoryMethod=function(){return new Rectangle();};
    }
    RectangleCreator.prototype = new FigureCreator();
    RectangleCreator.prototype.constructor = RectangleCreator;
    
    function CircleCreator() {
        this.factoryMethod=function(){return new Circle();};
    }
    CircleCreator.prototype = new FigureCreator();
    CircleCreator.prototype.constructor = CircleCreator;

    function TriangleCreator() {
        this.factoryMethod=function(){return new Triangle();};
    }
    TriangleCreator.prototype = new FigureCreator();
    TriangleCreator.prototype.constructor = TriangleCreator;
    
    function CompositeCreator(x1,y1,x2,y2) {
        this.factoryMethod=function(x1,y1,x2,y2){return new Composite(x1,y1,x2,y2);};
    }
    CompositeCreator.prototype = new FigureCreator();
    CompositeCreator.prototype.constructor = CompositeCreator;
    
    return {
        rectangle: new RectangleCreator(),
        triangle: new TriangleCreator(),
        composite: new CompositeCreator(),
        circle: new CircleCreator()
    };
})()