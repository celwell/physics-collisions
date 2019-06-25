var WIDTH;
var HEIGHT;
var g;
var r = 30;
var halfR = Math.floor(this.r/2);
var maxStartVel = 15;
var mouseX = 0;
var mouseY = 0;
var mouseOver = true;
var carray = new Array();

// Draw Function
function draw()
{
	g.canvas.width  = window.innerWidth;
    g.canvas.height = window.innerHeight;
    clear();
	var i;
	for (i=0; i<carray.length; i++)
	{
		carray[i].move();
		carray[i].draw(i);
	}

	requestAnimationFrame(draw);
}

// Main Function To Start
function start()
{
	// Get context of the canvas, we can use this to paint to the canvas
	g = $('#canvas')[0].getContext("2d");
	WIDTH = $("#canvas").width();
	HEIGHT = $("#canvas").height();
	// Feel free to change the 80 to a different number, if it is too high there will be lag
	carray = new Array(50);
	for (i=0; i<carray.length; i++)
	{
		carray[i] = new Square(Math.random() * WIDTH, Math.random() * HEIGHT);
	}
	requestAnimationFrame(draw);
}

// Square Class	
function Square(x,y)
{
	this.x = x;
	this.y = y;
	this.startAngle = Math.random()*Math.PI*2;
	this.startVel = Math.random()*maxStartVel;
	this.dx = this.startVel*Math.cos(this.startAngle);
	this.dy = this.startVel*Math.sin(this.startAngle);
	this.collision = 0;
	this.collisionAngle = 0;
	
	this.draw = function(num)
	{
		let radius = r / 2;
		let smoosh = 0;
		
		//g.fillStyle = "rgba(30, 90, " + (210 + Math.floor(this.collision)) + ", 0.9)";
		g.fillStyle = "rgba(255, 255, 255, " + Math.min(this.collision/2, 0.8) + ")";

		if (this.collision > 0)
		{
			// g.strokeStyle = "#0055bb";
			//g.fillStyle = "rgba(0, 210, 120, 1)";

			this.collision *= 0.8;
			//radius = radius * 0.3;
			smoosh = this.collision / 4;
		}
		else
		{
			// g.strokeStyle = "#4499ff";
		}
		//g.fillRect(this.x-halfR, this.y-halfR, r, r);

		g.strokeStyle = "rgba(102, 126, 249, 1)";
		g.lineWidth = 3;
		g.beginPath();
		//g.arc(this.x, this.y, radius-2, 0, Math.PI * 2);
		g.ellipse(this.x, this.y, radius+(smoosh/2)-2, (radius-smoosh)-2, Math.PI / 2 + this.collisionAngle, 0, (Math.PI * 2));
		g.stroke();
		g.strokeStyle = "rgba(82, 159, 252, 1)";
		g.beginPath();
		//g.arc(this.x, this.y, radius-5, 0, Math.PI * 2);
		g.ellipse(this.x, this.y, radius+(smoosh/2)-5, (radius-smoosh)-5, Math.PI / 2 + this.collisionAngle, 0, (Math.PI * 2));
		g.stroke();
		g.strokeStyle = "rgba(131, 185, 252, 1)";
		g.beginPath();
		//g.arc(this.x, this.y, radius-8, 0, Math.PI * 2);
		g.ellipse(this.x, this.y, radius+(smoosh/2)-8, (radius-smoosh)-8, Math.PI / 2 + this.collisionAngle, 0, (Math.PI * 2));
		g.stroke();

		
		g.beginPath();
		//g.arc(this.x, this.y, radius-9, 0, Math.PI * 2);
		g.ellipse(this.x, this.y, radius+(smoosh/2)-9, (radius-smoosh)-9, Math.PI / 2 + this.collisionAngle, 0, (Math.PI * 2));
		g.fill();
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
		
		if (mouseOver && Math.sqrt((mouseX - this.x) * (mouseX - this.x) + (mouseY - this.y) * (mouseY - this.y)) < r / 2)
		{
			this.boost();
		}
		
		this.dx *= .99;
		//this.dy += .15;
		
		if(this.x + halfR  > WIDTH)
		{
			this.collision = 15;
			this.collisionAngle = 0;
			this.x = WIDTH - halfR;
			this.dx = Math.abs(this.dx) * -1 * .75;
		}
		else if (this.x - halfR < 0)
		{
			this.collision = 15;
			this.collisionAngle = 0;
			this.x = halfR;
			this.dx = Math.abs(this.dx) * .75;
		}
		
		if (this.y + halfR > HEIGHT)
		{
			this.collision = 15;
			this.collisionAngle = Math.PI / 2;
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
			this.collision = 15;
			this.collisionAngle = Math.PI / 2;
			this.y = halfR;
			this.dy = Math.abs(this.dy) * .75;
		}
		
		for (i=0; i<carray.length; i++)
		{
			if ((vx = carray[i].x-this.x) > - r && vx < r && (vy = carray[i].y-this.y) > - r && vy < r)
			{
				vlen = Math.sqrt(vx * vx + vy * vy);
				if (vlen < r && vlen > 1)
				{
					this.collision = vlen / 3;
					carray[i].collision = vlen / 3;
					dax = vx/vlen;
					day = vy/vlen;
					diff = r-vlen;
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
					this.collisionAngle = Math.atan(vc4/vc2);
					carray[i].dx += .9*vc1;
					carray[i].dy += .9*vc3;
					carray[i].collisionAngle = Math.atan(vc3/vc1);
					if (dp1 <= 0 || dp2 >= 0)
					{
						vlen = Math.sqrt(vx*vx+vy*vy);
						if (vlen<r)
						{
							diff = (r-vlen)/2;
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


function clear() 
{
	//g.fillStyle = "rgba(255, 255, 255, 0.3)";
	g.fillStyle = "rgba(0, 0, 0, 1)";
	g.fillRect(0, 0, WIDTH, HEIGHT);
}

// Use JQuery to wait for document load
$(document).ready(function()
{
	$('#canvas').mousemove(function(e) {
		mouseX = e.pageX - $('#canvas').position().left;
		mouseY = e.pageY - $('#canvas').position().top;
	});
	$('#canvas').mouseover(function(e) {
		mouseOver = true;
	}).mouseout(function(e) {
		mouseOver = false;
	});
	$('#canvas').mousedown(function(e) {
		for (i=0; i<carray.length; i++)	{
			carray[i].boost();
		}
	});
	start();
});
