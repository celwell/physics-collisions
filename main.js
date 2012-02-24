var WIDTH;
var HEIGHT;
var g;
var r = 6;
var halfR = Math.floor(this.r/2);
var maxStartVel = 8;
var mouseX = 0;
var mouseY = 0;
var mouseOver = true;
var carray = new Array();

// Main Function To Start
function start()
{
	g = $('#canvas')[0].getContext("2d");
	WIDTH = $("#canvas").width();
	HEIGHT = $("#canvas").height();
	carray = new Array(80);
	for (i=0; i<carray.length; i++)
	{
		carray[i] = new Circle(Math.random()*WIDTH,Math.random()*HEIGHT);
	}
	return setInterval(draw, 10);
}

// Circle Class	
function Circle(x,y)
{
	this.x = x;
	this.y = y;
	this.startAngle = Math.random()*Math.PI*2;
	this.startVel = Math.random()*maxStartVel;
	this.dx = this.startVel*Math.cos(this.startAngle);
	this.dy = this.startVel*Math.sin(this.startAngle);
	this.collision = 0;
	
	this.draw = function(num)
	{
		//g.beginPath();
		//g.fillStyle = "#2277CC";
		if (this.collision > 0)
		{
			g.fillStyle = "#0055bb";
			this.collision--;
		}
		else
		{
			g.fillStyle = "#4499ff";
		}
		//g.arc(this.x, this.y, r, 0, Math.PI*2, true);
		//g.closePath();
		//g.fill();
		g.fillRect(this.x-halfR, this.y-halfR, r, r);
	}
	
	this.getX = function()
	{
		return x;
	}
	
	this.getY = function()
	{
		return this.y;
	}
	
	this.boost = function()
	{
		angle = Math.random()*Math.PI*2;
		vel = Math.random()*(maxStartVel-maxStartVel*.4)+maxStartVel*.6;
		this.dx += vel*Math.cos(angle);
		this.dy += vel*Math.sin(angle);
	}
	
	this.move = function()
	{	
		this.x += this.dx;
		this.y += this.dy;
		
		if (mouseOver && Math.sqrt((mouseX - this.x) * (mouseX - this.x) + (mouseY - this.y) * (mouseY - this.y)) < r + 3)
		{
			this.boost();
		}
		
		this.dx *= .991;
		this.dy += .12;
		
		if(this.x + halfR  > WIDTH)
		{
			this.x = WIDTH - halfR;
			this.dx = Math.abs(this.dx) * -1 * .75;
		}
		else if (this.x - halfR < 0)
		{
			this.x = halfR;
			this.dx = Math.abs(this.dx) * .75;
		}
		
		if(this.y + halfR > HEIGHT)
		{
			this.y = HEIGHT - halfR;
			this.dy = Math.abs(this.dy) * -1 * .75;
			if (this.dy > -.625)
			{
				this.dy = 0;
				this.y = HEIGHT - halfR;
			}
		}
		else if (this.y - halfR < 0)
		{
			this.y = halfR;
			this.dy = Math.abs(this.dy) * .75;
		}
		
		for (i=0; i<carray.length; i++)
		{
			if ((vx = carray[i].x-this.x) > - 8 && vx < 8 && (vy = carray[i].y-this.y) > - 8 && vy < 8)
			{
				vlen = Math.sqrt(vx*vx+vy*vy);
				if (vlen < 8 && vlen > 1)
				{
					this.collision = 4;
					dax = vx/vlen;
					day = vy/vlen;
					diff = 8-vlen;
					dp1 = this.dx*dax+this.dy*day;
					dp2 = carray[i].dx*dax+carray[i].dy*day;
					tv = Math.abs(dp1) + Math.abs(dp2);
					if (dp1>0)
					{
						ra = dp1/tv;
						this.x -= ra*dax*diff;
						this.y -= ra*dax*diff;
					}
					if (dp2>0)
					{
						ra = dp2/tv;
						carray[i].x -= ra*dax*diff;
						carray[i].y -= ra*dax*diff;
					}
					vc1 = dp1*dax;
					vc2 = dp2*dax;
					vc3 = dp1*day;
					vc4 = dp2*day;
					this.dx -= vc1;
					this.dy -= vc3;
					carray[i].dx -= vc2;
					carray[i].dy -= vc4;
					this.dx += .9*vc2;
					this.dy += .9*vc4;
					carray[i].dx += .9*vc1;
					carray[i].dy += .9*vc3;
					if (dp1 <= 0 || dp2 >= 0)
					{
						vlen = Math.sqrt(vx*vx+vy*vy);
						if (vlen<8)
						{
							diff = (8-vlen)/2;
							this.x -= diff*dax;
							this.y -= diff*day;
							carray[i].x += diff*dax;
							carray[i].y += diff*day;
						}
					}
				}
			}
		}		
	}
}


// Draw Function
function draw()
{
	clear();
	var i;
	for (i=0; i<carray.length; i++)
	{
		carray[i].move();
		carray[i].draw(i);
	}
}

function clear() 
{
	g.fillStyle = "#E4E0D7";
	g.fillRect(0, 0, WIDTH, HEIGHT);
}

// Use JQuery to wait for document load
$(document).ready(function()
{
	$('#canvas').mousemove(function(e){
		mouseX = e.pageX - $('#canvas').position().left;
		mouseY = e.pageY - $('#canvas').position().top;
	});
	$('#canvas').mouseover(function(e){
		mouseOver = true;
	}).mouseout(function(e){
		mouseOver = false;
	});
	$('#canvas').mousedown(function(e){
		for (i=0; i<carray.length; i++)	{
			carray[i].boost();
		}
	});
	start();
});