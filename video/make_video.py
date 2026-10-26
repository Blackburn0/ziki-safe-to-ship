"""Makes public/video/explainer.mp4: a short video that explains the idea to a 5-year-old.

Each scene in script.json gets a simple drawing (Pillow, in Ziki's colours), a voice (Windows' built-in Zira voice) and a slow zoom
(ffmpeg). Captions go to explainer.vtt. Needs Python with Pillow, Windows (for the voice) and ffmpeg.

    python video/make_video.py WORK_DIR [FFMPEG]
"""
import json
import math
import os
import subprocess
import sys
import wave

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = sys.argv[1]
FFMPEG = sys.argv[2] if len(sys.argv) > 2 else "ffmpeg"
OUT = os.path.join(ROOT, "public", "video")
os.makedirs(WORK, exist_ok=True)
os.makedirs(OUT, exist_ok=True)

W, H, S = 1280, 720, 2  # drawn at twice the size for smooth edges
BG, NIGHT, BLUE, SKY, INK, MUTED = "#f5f7fc", "#1b2340", "#2e6fef", "#38a3ff", "#15121f", "#5f6577"
OK, OK_BG, WARN, WARN_BG, BAD, BAD_BG, TINT, WHITE = "#146c43", "#e3f6ec", "#7a4e00", "#fdf3d7", "#a3261a", "#fde8e4", "#eaf2fe", "#ffffff"
GREEN = "#16a34a"
SKIN, HAIR = "#8d5524", "#2a1a12"


def font(size, bold=True):
    return ImageFont.truetype("C:/Windows/Fonts/" + ("arialbd.ttf" if bold else "arial.ttf"), int(size * S))


def p(*xs):
    return [x * S for x in xs]


def canvas(bg=BG):
    im = Image.new("RGB", (W * S, H * S), bg)
    return im, ImageDraw.Draw(im)


def circle(d, x, y, r, **kw):
    d.ellipse(p(x - r, y - r, x + r, y + r), **kw)


def title(d, text, dark=False):
    d.text(p(W / 2, 64), text, font=font(46), fill=WHITE if dark else INK, anchor="mm")


# ---- characters and props


def ada(d, x, y, s=1.0, mood="happy", shirt=BLUE):
    """Ada, standing (head at x,y). mood: happy, worried, sleep."""
    d.rounded_rectangle(p(x - 70 * s, y + 70 * s, x + 70 * s, y + 230 * s), radius=50 * S * s, fill=shirt)  # body
    circle(d, x, y, 70 * s, fill=SKIN)  # head
    d.chord(p(x - 76 * s, y - 84 * s, x + 76 * s, y + 40 * s), 180, 360, fill=HAIR)  # hair
    circle(d, x - 66 * s, y - 30 * s, 26 * s, fill=HAIR)
    circle(d, x + 66 * s, y - 30 * s, 26 * s, fill=HAIR)
    if mood == "sleep":
        for ex in (-25, 25):
            d.arc(p(x + (ex - 12) * s, y - 2 * s, x + (ex + 12) * s, y + 16 * s), 200, 340, fill=INK, width=int(5 * S * s))
    else:
        for ex in (-25, 25):
            circle(d, x + ex * s, y + 6 * s, 8 * s, fill=INK)
            circle(d, x + ex * s + 3 * s, y + 3 * s, 2.5 * s, fill=WHITE)
    if mood == "worried":
        d.arc(p(x - 22 * s, y + 38 * s, x + 22 * s, y + 66 * s), 200, 340, fill=INK, width=int(5 * S * s))
        d.line(p(x - 40 * s, y - 16 * s, x - 14 * s, y - 10 * s), fill=INK, width=int(4 * S * s))
        d.line(p(x + 40 * s, y - 16 * s, x + 14 * s, y - 10 * s), fill=INK, width=int(4 * S * s))
    else:
        d.arc(p(x - 26 * s, y + 18 * s, x + 26 * s, y + 52 * s), 20, 160, fill=INK, width=int(5 * S * s))
    circle(d, x - 44 * s, y + 30 * s, 9 * s, fill="#c46a4a")  # cheeks
    circle(d, x + 44 * s, y + 30 * s, 9 * s, fill="#c46a4a")


def robot(d, x, y, s=1.0, colour=BLUE, eyes="happy", tool=None):
    """A little robot helper (top of head at x,y)."""
    d.line(p(x, y - 24 * s, x, y), fill=colour, width=int(5 * S * s))
    circle(d, x, y - 30 * s, 9 * s, fill=SKY)
    d.rounded_rectangle(p(x - 46 * s, y, x + 46 * s, y + 70 * s), radius=20 * S * s, fill=TINT, outline=colour, width=int(5 * S * s))
    for ex in (-18, 18):
        circle(d, x + ex * s, y + 32 * s, 11 * s, fill=WHITE, outline=colour, width=int(3 * S * s))
        circle(d, x + ex * s, y + 34 * s, 5 * s, fill=INK)
    d.arc(p(x - 14 * s, y + 42 * s, x + 14 * s, y + 60 * s), 20, 160, fill=colour, width=int(4 * S * s))
    d.rounded_rectangle(p(x - 38 * s, y + 78 * s, x + 38 * s, y + 140 * s), radius=16 * S * s, fill=colour)  # body
    circle(d, x, y + 108 * s, 9 * s, fill=SKY)
    for side in (-1, 1):  # arms
        d.line(p(x + side * 38 * s, y + 92 * s, x + side * 62 * s, y + 118 * s), fill=colour, width=int(9 * S * s))
    if tool == "wrench":
        d.line(p(x + 62 * s, y + 118 * s, x + 84 * s, y + 92 * s), fill=MUTED, width=int(8 * S * s))
        circle(d, x + 88 * s, y + 86 * s, 11 * s, outline=MUTED, width=int(6 * S * s))
    if tool == "brush":
        d.line(p(x + 62 * s, y + 118 * s, x + 90 * s, y + 80 * s), fill="#8a5a2b", width=int(8 * S * s))
        d.rounded_rectangle(p(x + 82 * s, y + 56 * s, x + 104 * s, y + 84 * s), radius=6 * S, fill=GREEN)


def app_window(d, x0, y0, w, h, label="Zedu", dark=False):
    d.rounded_rectangle(p(x0, y0, x0 + w, y0 + h), radius=22 * S, fill=WHITE, outline="#2b3557" if dark else "#d5dcea", width=3 * S)
    d.rounded_rectangle(p(x0, y0, x0 + w, y0 + 44), radius=22 * S, fill=TINT)
    d.rectangle(p(x0, y0 + 26, x0 + w, y0 + 44), fill=TINT)
    for k, c in enumerate(("#ff6b6b", "#ffd166", "#06d6a0")):
        circle(d, x0 + 26 + k * 22, y0 + 22, 7, fill=c)
    d.text(p(x0 + w / 2, y0 + 23), label, font=font(20), fill=BLUE, anchor="mm")
    for k in range(3):  # content blocks
        yy = y0 + 70 + k * ((h - 90) / 3)
        d.rounded_rectangle(p(x0 + 24, yy, x0 + w - 24, yy + (h - 90) / 3 - 16), radius=12 * S, fill=BG)


def tick(d, x, y, r, colour):
    d.line(p(x - r * 0.5, y, x - r * 0.12, y + r * 0.4, x + r * 0.55, y - r * 0.4), fill=colour, width=int(max(6, r * 0.22) * S), joint="curve")


def card(d, x0, y0, w, h, tone_bg, tone_fg, icon, line1, line2=None):
    d.rounded_rectangle(p(x0, y0, x0 + w, y0 + h), radius=24 * S, fill=WHITE, outline=tone_fg, width=3 * S)
    circle(d, x0 + 54, y0 + h / 2, 30, fill=tone_bg)
    if icon == "tick":
        tick(d, x0 + 54, y0 + h / 2, 22, tone_fg)
    else:
        d.text(p(x0 + 54, y0 + h / 2), icon, font=font(32), fill=tone_fg, anchor="mm")
    if line2:
        d.text(p(x0 + 104, y0 + h / 2 - 18), line1, font=font(30), fill=INK, anchor="lm")
        d.text(p(x0 + 104, y0 + h / 2 + 20), line2, font=font(24, bold=False), fill=MUTED, anchor="lm")
    else:
        d.text(p(x0 + 104, y0 + h / 2), line1, font=font(30), fill=INK, anchor="lm")


def pill_button(d, x0, y0, text, bg, fg=WHITE, w=None):
    f = font(26)
    tw = d.textlength(text, font=f) / S
    w = w or tw + 64
    d.rounded_rectangle(p(x0, y0, x0 + w, y0 + 60), radius=30 * S, fill=bg)
    d.text(p(x0 + w / 2, y0 + 30), text, font=f, fill=fg, anchor="mm")
    return w


def stars(d):
    for (sx, sy) in [(120, 160), (260, 110), (420, 190), (900, 130), (1040, 210), (1180, 120), (700, 90), (560, 140)]:
        circle(d, sx, sy, 4, fill="#fff3b0")


def moon(d, x, y):
    circle(d, x, y, 46, fill="#fff3b0")
    circle(d, x + 22, y - 12, 40, fill=NIGHT)


def bed(d, x, y, mood):
    d.rounded_rectangle(p(x - 190, y + 60, x + 190, y + 150), radius=24 * S, fill="#c9d6f5")  # bed
    d.rounded_rectangle(p(x - 175, y - 70, x - 45, y + 40), radius=24 * S, fill=WHITE)  # pillow
    ada(d, x - 110, y - 40, 0.6, mood=mood)
    d.rounded_rectangle(p(x - 150, y + 40, x + 190, y + 120), radius=30 * S, fill=BLUE)  # blanket


# ---- scenes


def scene_ada():
    im, d = canvas()
    title(d, "Meet Ada")
    ada(d, 340, 300, 1.2)
    app_window(d, 640, 180, 520, 360)
    for k in range(6):  # people using the app
        x = 680 + k * 86
        circle(d, x, 600, 22, fill=["#f7b267", "#9ad1d4", "#f4845f", "#b8de6f", "#cdb4db", "#ffd166"][k])
        d.rounded_rectangle(p(x - 26, 624, x + 26, 668), radius=20 * S, fill="#d5dcea")
    return im


def scene_night():
    im, d = canvas(NIGHT)
    stars(d)
    moon(d, 1120, 150)
    title(d, "Robots work at night", dark=True)
    app_window(d, 440, 200, 400, 300, dark=True)
    robot(d, 270, 330, 1.0, tool="wrench")
    robot(d, 990, 360, 0.9, colour="#6aaaf0", tool="wrench")
    robot(d, 640, 540, 0.7)
    d.text(p(150, 620), "Z z z", font=font(42), fill="#fff3b0", anchor="lm")
    return im


def scene_worry():
    im, d = canvas(NIGHT)
    stars(d)
    title(d, "Ada worries", dark=True)
    bed(d, 380, 470, "worried")
    # thought bubble
    for (bx, by, br) in [(560, 430, 14), (610, 380, 22)]:
        circle(d, bx, by, br, fill=WHITE)
    d.rounded_rectangle(p(640, 150, 1160, 420), radius=60 * S, fill=WHITE)
    app_window(d, 690, 190, 280, 200)
    d.line(p(740, 250, 800, 320, 770, 360), fill=BAD, width=8 * S)  # a crack
    robot(d, 1060, 210, 0.7, colour="#6aaaf0")
    circle(d, 1110, 190, 26, fill=BAD)
    d.text(p(1110, 190), "!", font=font(34), fill=WHITE, anchor="mm")
    return im


def phone(d, x0, y0, w=300, h=520):
    d.rounded_rectangle(p(x0, y0, x0 + w, y0 + h), radius=40 * S, fill=INK)
    d.rounded_rectangle(p(x0 + 14, y0 + 14, x0 + w - 14, y0 + h - 14), radius=30 * S, fill=WHITE)


def scene_morning():
    im, d = canvas("#fff7e0")
    circle(d, 1150, 120, 60, fill="#ffd166")
    for k in range(10):
        a = k * math.pi / 5
        d.line(p(1150 + 78 * math.cos(a), 120 + 78 * math.sin(a), 1150 + 100 * math.cos(a), 120 + 100 * math.sin(a)), fill="#ffd166", width=6 * S)
    title(d, "Good morning, Ada!")
    ada(d, 300, 300, 1.1)
    phone(d, 560, 140, 620, 480)
    d.text(p(870, 210), "Ziki", font=font(28), fill=BLUE, anchor="mm")
    card(d, 600, 250, 540, 130, WARN_BG, WARN, "!", "Your app is fine.", "2 things need you.")
    for k in range(2):
        d.rounded_rectangle(p(600, 410 + k * 80, 1140, 470 + k * 80), radius=16 * S, fill=BG)
    return im


def scene_undo():
    im, d = canvas()
    title(d, "Thing one: robots fix their own mistake")
    robot(d, 230, 240, 1.3)
    # big undo arrow
    d.arc(p(380, 200, 620, 440), 200, 20, fill=BLUE, width=16 * S)
    d.polygon(p(372, 270, 420, 300, 360, 330), fill=BLUE)
    app_window(d, 680, 160, 480, 250)
    circle(d, 920, 300, 50, fill=OK_BG)
    tick(d, 920, 300, 34, OK)
    d.rounded_rectangle(p(300, 500, 1160, 650), radius=24 * S, fill=WHITE, outline="#d5dcea", width=3 * S)
    d.text(p(340, 545), "New rule for every robot?", font=font(30), fill=INK, anchor="lm")
    d.text(p(340, 595), "Test with lots of notifications first.", font=font(24, bold=False), fill=MUTED, anchor="lm")
    pill_button(d, 900, 548, "Add the rule", BLUE)
    return im


def scene_colour():
    im, d = canvas()
    title(d, "Thing two: Ada decides big changes")
    robot(d, 180, 220, 1.2, tool="brush")
    for k, (label, colour) in enumerate((("Now", BLUE), ("Maybe?", GREEN))):
        x0 = 420 + k * 380
        d.rounded_rectangle(p(x0, 170, x0 + 330, 400), radius=26 * S, fill=WHITE, outline="#d5dcea", width=3 * S)
        d.text(p(x0 + 165, 215), label, font=font(28), fill=MUTED, anchor="mm")
        pill_button(d, x0 + 45, 270, "Send", colour, w=240)
    ada(d, 1110, 470, 0.7)
    for k, (t, bg, fg) in enumerate((("Yes", BLUE, WHITE), ("No", "#e3e8f2", INK), ("Ask", "#e3e8f2", INK))):
        pill_button(d, 360 + k * 190, 520, t, bg, fg, w=160)
    return im


def scene_fine():
    im, d = canvas()
    title(d, "The rest was fine")
    card(d, 160, 170, 960, 130, OK_BG, OK, "tick", "13 changes went fine.", "Nothing to do. Tucked into one line.")
    d.rounded_rectangle(p(160, 360, 1120, 500), radius=24 * S, fill=WHITE, outline="#d5dcea", width=3 * S)
    d.text(p(200, 410), "Don't like one? Press Undo.", font=font(30), fill=INK, anchor="lm")
    d.text(p(200, 455), "The robots put the old one back.", font=font(24, bold=False), fill=MUTED, anchor="lm")
    pill_button(d, 900, 400, "Undo", BAD_BG, BAD, w=180)
    robot(d, 640, 540, 0.6)
    return im


def scene_rules():
    im, d = canvas()
    title(d, "Ada's simple rules")
    ada(d, 220, 300, 1.0)
    d.rounded_rectangle(p(420, 160, 1180, 560), radius=30 * S, fill=WHITE, outline="#d5dcea", width=3 * S)
    rows = (("Small fixes", "Go ahead!", OK_BG, OK), ("Big changes", "Ask me first", WARN_BG, WARN))
    for k, (what, rule, bg, fg) in enumerate(rows):
        y = 210 + k * 170
        d.text(p(470, y + 50), what, font=font(36), fill=INK, anchor="lm")
        d.text(p(800, y + 50), "→", font=font(40), fill=MUTED, anchor="mm")
        d.rounded_rectangle(p(850, y + 15, 1140, y + 85), radius=35 * S, fill=bg)
        d.text(p(995, y + 50), rule, font=font(28), fill=fg, anchor="mm")
    robot(d, 1060, 580, 0.45)
    return im


def scene_clear():
    im, d = canvas(NIGHT)
    stars(d)
    moon(d, 1140, 140)
    bed(d, 330, 470, "sleep")
    d.text(p(150, 330), "z z", font=font(40), fill="#fff3b0", anchor="lm")
    circle(d, 860, 330, 130, fill=OK_BG)
    tick(d, 860, 330, 80, OK)
    d.text(p(860, 530), "All clear!", font=font(64), fill=WHITE, anchor="mm")
    robot(d, 1120, 470, 0.6, tool="wrench")
    return im


SCENES = {"ada": scene_ada, "night": scene_night, "worry": scene_worry, "morning": scene_morning, "undo": scene_undo,
          "colour": scene_colour, "fine": scene_fine, "rules": scene_rules, "clear": scene_clear}


def speak(text, path):
    ps = ("Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
          "$s.SelectVoice('Microsoft Zira Desktop'); $s.Rate = -2; "
          f"$s.SetOutputToWaveFile('{path}'); $s.Speak([Console]::In.ReadToEnd()); $s.Dispose()")
    subprocess.run(["powershell", "-NoProfile", "-Command", ps], input=text, text=True, check=True)
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()


def stamp(t):
    return f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{t % 60:06.3f}"


def main():
    script = json.load(open(os.path.join(ROOT, "video", "script.json"), encoding="utf-8"))
    parts, cues, t = [], [], 0.0
    for n, item in enumerate(script):
        img = os.path.join(WORK, f"{n:02d}.png")
        SCENES[item["scene"]]().resize((W, H), Image.LANCZOS).save(img)
        if n == 0:
            Image.open(img).save(os.path.join(OUT, "poster.png"))
        wav = os.path.join(WORK, f"{n:02d}.wav")
        secs = speak(item["say"], wav)
        dur = secs + 0.8  # a short pause after each line
        frames = int(dur * 30)
        clip = os.path.join(WORK, f"{n:02d}.mp4")
        subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-loop", "1", "-i", img, "-i", wav,
                        "-filter_complex", f"[0]scale=2560:-1,zoompan=z='min(zoom+0.0005,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps=30[v];[1]apad[a]",
                        "-map", "[v]", "-map", "[a]", "-t", f"{dur:.2f}", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "24",
                        "-c:a", "aac", "-b:a", "96k", "-ar", "44100", "-ac", "1", clip], check=True)
        parts.append(clip)
        cues.append((t, t + secs, item["say"]))
        t += dur
        print(f"scene {n + 1}/{len(script)}: {item['scene']} {dur:.1f}s")
    listing = os.path.join(WORK, "parts.txt")
    open(listing, "w").write("".join(f"file '{c}'\n" for c in parts))
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listing, "-c", "copy", "-movflags", "+faststart",
                    os.path.join(OUT, "explainer.mp4")], check=True)
    with open(os.path.join(OUT, "explainer.vtt"), "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n" + "\n".join(f"{stamp(a)} --> {stamp(b)}\n{text}\n" for a, b, text in cues))
    print(f"done: {t:.1f}s, {os.path.getsize(os.path.join(OUT, 'explainer.mp4')) // 1024} KB")


main()
