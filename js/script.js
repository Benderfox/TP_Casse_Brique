var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        var x = canvas.width / 2;
        var y = canvas.height - 30;
        var dx = 2;
        var dy = -2;
        var ballRadius = 10;
        var paddleHeight = 10;
        var paddleWidth = 100;
        var paddleX = (canvas.width - paddleWidth) / 2;
        var ballColor = "#F50EB6";
        var brickRowCount = 5;
        var brickColumnCount = 3;
        var brickWidth = 75;
        var brickHeight = 20;
        var brickPadding = 10;
        var brickOffsetTop = 30;
        var brickOffsetLeft = 30;

        var rightPressed = false;
        var leftPressed = false;

        var bricks = [];
        for (var c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        var score = 0;
        var lives = 3;

        function drawBricks() {
            for (var c = 0; c < brickColumnCount; c++) {
                for (var r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status == 1) {
                        var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                        var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = ballColor;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        function collisionDetection() {
            for (var c = 0; c < brickColumnCount; c++) {
                for (var r = 0; r < brickRowCount; r++) {
                    var b = bricks[c][r];
                    if (b.status == 1) {
                        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                            dy = -dy;
                            b.status = 0;
                            score++;
                            if (score == brickRowCount * brickColumnCount) {
                                alert("Félicitations, vous avez gagné!");
                                document.location.reload();
                            }
                        }
                    }
                }
            }
        }

        function drawScore() {
            ctx.font = "16px Arial";
            ctx.fillStyle = ballColor;
            ctx.fillText("Score: " + score, 8, 20);
        }

        function drawLives() {
            ctx.font = "16px Arial";
            ctx.fillStyle = ballColor;
            ctx.fillText("Vies: " + lives, canvas.width - 65, 20);
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = ballColor;
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = ballColor;
            ctx.fill();
            ctx.closePath();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            drawScore();
            drawLives();
            collisionDetection();

            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            } else if (leftPressed && paddleX > 0) {
                paddleX -= 7;
            }

            if (y + dy - ballRadius < 0) {
                dy = -dy;
            } else if (y + dy + ballRadius > canvas.height - paddleHeight) {
                if (x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                } else {
                    lives--;
                    if (!lives) {
                        alert("Game Over! Votre score est " + score);
                        document.location.reload();
                    } else {
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = 2;
                        dy = -2;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                }
            }

            if (x + dx - ballRadius < 0 || x + dx + ballRadius > canvas.width) {
                dx = -dx;
            }

            x += dx;
            y += dy;
            requestAnimationFrame(draw);
        }

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        function keyDownHandler(e) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = true;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = true;
            }
        }

        function keyUpHandler(e) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = false;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = false;
            }
        }

        function setCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        function getCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function updateBackgroundColor() {
            var backgroundColor = document.getElementById("couleurback").value;
            canvas.style.backgroundColor = backgroundColor;
            setCookie('backgroundColor', backgroundColor, 7);
        }

        function updateElementColor() {
            ballColor = document.getElementById("couleurtitre").value;
            document.getElementById("montitre").style.color = ballColor;
            var colorElements = document.getElementsByClassName("colorElement");
            for (var i = 0; i < colorElements.length; i++) {
                colorElements[i].style.color = ballColor;
            }
            setCookie('elementColor', ballColor, 7);
        }

        document.getElementById("couleurback").addEventListener("input", updateBackgroundColor);
        document.getElementById("couleurtitre").addEventListener("input", updateElementColor);

        document.getElementById("monbouton").addEventListener("click", function() {
            document.location.reload();
        });

        function loadSettings() {
            var backgroundColor = getCookie('backgroundColor');
            var elementColor = getCookie('elementColor');
            if (backgroundColor) {
                document.getElementById("couleurback").value = backgroundColor;
                canvas.style.backgroundColor = backgroundColor;
            }
            if (elementColor) {
                document.getElementById("couleurtitre").value = elementColor;
                ballColor = elementColor;
                document.getElementById("montitre").style.color = elementColor;
                var colorElements = document.getElementsByClassName("colorElement");
                for (var i = 0; i < colorElements.length; i++) {
                    colorElements[i].style.color = elementColor;
                }
            }
        }

        loadSettings();
        draw();