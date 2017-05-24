# Setting up the Raspberry Pi

apt-get install xscreensaver

https://www.raspberrypi.org/documentation/configuration/screensaver.md

## Tontec Screen Installation

[Initial Driver Setup](http://www.itontec.com/tontec-3-5-inch-screen-driver-install-instructions/)

1. Update
```
sudo apt-get update
sudo apt-get upgrade
sudo reboot
```
2. Update Firmware (Optional) - We now need to update the dtb file to the newest version to support Tontec screen.
```
cd /boot/overlays
sudo rm mz61581-overlay.dtb
sudo wget http://www.itontec.com/mz61581-overlay.dtb
sudo reboot
```
3. Open `/boot/config.txt`, And add these lines to the bottom
```
dtparam=spi=on
dtoverlay=mz61581,rotate=0
```
**YES THE `rotate=0` IS CORRECT, IT WILL MAKE THE DISPLAY BE _portrait_**

### Calibration

#### Original doesn't work!

[Calibration](http://www.itontec.com/how-to-calibrate-the-touchscreen-for-ras-with-raspbian-jessie/)

`xinput` is not a valid output now? <https://github.com/tias/xinput_calibrator/blob/master/src/calibrator/XorgPrint.cpp>

#### Do this instead

```bash
sudo apt-get install xserver-xorg-input-evdev
# evedev man page => https://linux.die.net/man/4/evdev
# Then comment out the `touchscreen` directive block in /etc/X11/xorg.conf.d/40-libinput.conf


wget http://adafruit-download.s3.amazonaws.com/xinput-calibrator_0.7.5-1_armhf.deb
```

As the pi user on the desktop (you can type this in on VNC and then do the actual touchscreen actions on the touchscreen).  

   sudo xinput_calibrator --output-type xorg.conf.d -v

take the output and put it into:

   /etc/X11/xorg.conf.d/99-calibration.conf

add invert for both axes...

```
Section "InputClass"
        Identifier      "calibration"
        MatchProduct    "ADS7846 Touchscreen"
        Option  "Calibration"   "194 3930 3946 109"
        Option  "SwapAxes"      "1"
        Option "InvertX" "1"
        Option "InvertY" "1"
EndSection
```
**Reboot**

## Tidbits of useful information

[ALT] + hold down left mouse, lets you move an X window anytime (in case it is bigger than your screen)

very useful tool: `apt-get install xdotool` ; `xdotool getmouselocation`

## VNC

Start VNC server with a *higher* resolution that the physical screen by using:

   vncserver-virtual

## Driver Listing

[Driver Listing](https://github.com/raspberrypi/firmware/blob/master/boot/overlays/README)
