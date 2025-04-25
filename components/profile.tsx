"use client"

import { useState, useEffect } from "react"
import { MobileLayout } from "./mobile-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  ChevronRight,
  Moon,
  User,
  Apple,
  Watch,
  Users,
  Gift,
  Star,
  Bell
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useTheme } from "next-themes"

export function Profile() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showInvite, setShowInvite] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
const [mobile, setMobile] = useState("");
const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);

const [connectedApp, setConnectedApp] = useState<"apple" | "fitbit" | null>(null);
const [connectStatus, setConnectStatus] = useState("");



const [showProModal, setShowProModal] = useState(false);
const [proMessage, setProMessage] = useState("");









  useEffect(() => {
    setMounted(true)
  }, [])
  const handleConnectApp = (app: "apple" | "fitbit") => {
    if (connectedApp === app) {
      // Disconnect
      setConnectedApp(null);
      setConnectStatus(`${app === "apple" ? "Apple Health" : "Fitbit"} disconnected.`);
    } else {
      // Connect new app and disconnect previous one
      setConnectedApp(app);
      setConnectStatus(`${app === "apple" ? "Apple Health" : "Fitbit"} connected.`);
    }
  };
  
  


  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }
  {showInvite && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white dark:bg-background rounded-lg p-6 w-[90%] max-w-sm shadow-lg space-y-4">
      <h3 className="text-lg font-semibold text-center">Invite Your Friends</h3>
      <p className="text-sm text-muted-foreground text-center">Share the link below to invite friends to Aimeal.</p>

      <div className="bg-muted p-2 rounded flex justify-between items-center text-sm">
        <span className="truncate">https://aimeal.app/invite/alex123</span>
        <Button
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText("https://aimeal.app/invite/alex123");
          }}
        >
          Copy
        </Button>
      </div>

      <Button className="w-full" variant="secondary" onClick={() => setShowInvite(false)}>
        Close
      </Button>
    </div>
  </div>
)}
const [profilePic, setProfilePic] = useState<string | null>(null)

const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePic(reader.result as string)
      setStatusMessage("✅ Profile picture updated!")
      setTimeout(() => setStatusMessage(null), 3000) // Clear after 3s
    }
    reader.onerror = () => {
      setStatusMessage("❌ Failed to load image.")
      setTimeout(() => setStatusMessage(null), 3000)
    }
    reader.readAsDataURL(file)
  } else {
    setStatusMessage("❌ No file selected.")
    setTimeout(() => setStatusMessage(null), 3000)
  }
}



return (
  <MobileLayout>
    <div className="p-6 space-y-6 relative">
      {statusMessage && (
        <div className="absolute top-0 left-0 right-0 mx-auto mt-2 w-fit bg-black text-white text-sm py-2 px-4 rounded-md shadow-md z-30">
          {statusMessage}
        </div>
      )}



        <div>
          <h1 className="text-2xl font-bold">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your account</p>
        </div>

        <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16">
  <label htmlFor="profile-pic-upload" className="cursor-pointer">
    {profilePic ? (
      <img
        src={profilePic}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover border"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
        <User className="h-8 w-8 text-primary" />
      </div>
    )}
  </label>
  <input
    type="file"
    id="profile-pic-upload"
    accept="image/*"
    onChange={handleProfilePicChange}
    className="hidden"
  />
</div>

          <div>
            <h2 className="font-semibold">Alex Johnson</h2>
            <p className="text-sm text-muted-foreground">alex.johnson@example.com</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Personal Information</h3>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Alex Johnson" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="height">Height</Label>
                <Input id="height" defaultValue="175 cm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" defaultValue="68 kg" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="goal-weight">Goal Weight</Label>
              <div className="flex items-center space-x-2">
                <Input id="goal-weight" defaultValue="65" />
                <span className="text-sm">kg</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="activity-level">Activity Level</Label>
              <Select defaultValue="moderate">
                <SelectTrigger id="activity-level">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="light">Lightly Active</SelectItem>
                  <SelectItem value="moderate">Moderately Active</SelectItem>
                  <SelectItem value="active">Very Active</SelectItem>
                  <SelectItem value="extreme">Extremely Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="diet-type">Diet Type</Label>
              <Select defaultValue="balanced">
                <SelectTrigger id="diet-type">
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="lowcarb">Low Carb</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">App Settings</h3>

          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                  <span>Dark Mode</span>
                </div>
                {mounted && (
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={handleDarkModeToggle}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">Connected Apps</h3>

           {/* Apple Health Card */}
<Card className="border-none shadow-sm">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Apple className="h-5 w-5" />
        <span>Apple Health</span>
      </div>
      {connectedApp === "apple" ? (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            setConnectedApp(null)
            setConnectStatus("Disconnected Apple Health")
          }}
        >
          Disconnect
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          disabled={!!connectedApp}
          onClick={() => {
            setConnectedApp("apple")
            setConnectStatus("Connected to Apple Health")
          }}
        >
          Connect
        </Button>
      )}
    </div>
  </CardContent>
</Card>

{/* Fitbit Card */}
<Card className="border-none shadow-sm">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Watch className="h-5 w-5" />
        <span>Fitbit</span>
      </div>
      {connectedApp === "fitbit" ? (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            setConnectedApp(null)
            setConnectStatus("Disconnected Fitbit")
          }}
        >
          Disconnect
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          disabled={!!connectedApp}
          onClick={() => {
            setConnectedApp("fitbit")
            setConnectStatus("Connected to Fitbit")
          }}
        >
          Connect
        </Button>
      )}
    </div>
  </CardContent>
</Card>

{connectStatus && (
  <p className="text-sm text-muted-foreground text-center mt-2">
    {connectStatus}
  </p>
)}



          </div>
        </div>

        {/* 🚀 Invite Friends */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-medium">Invite Friends</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Share your referral link to earn 7 days of Pro.
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm bg-muted px-3 py-1 rounded font-mono select-all">
                aimeal.app/invite/yourcode
              </span>
              <Button
                size="sm"
                onClick={() =>
                  navigator.clipboard.writeText("aimeal.app/invite/yourcode")
                }
              >
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 💎 Upgrade to Pro */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <h2 className="text-sm font-medium">Go Pro</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Unlock AI meal insights and weekly trends.
            </p>
            <Button className="mt-2" variant="default" onClick={() => setShowProModal(true)}>
  Upgrade Now
</Button>


          </CardContent>
        </Card>

        {/* 🔔 Notification Preferences */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Get reminders to log your meals.
                </p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </CardContent>
        </Card>

        {/* 👥 Connect with Friends & Family */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-medium">Connect</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Add friends, family, or your trainer.
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowConnectModal(true)}>
  Find & Connect
</Button>

          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
  <CardContent className="p-4 flex justify-between items-center">
    <div className="text-sm font-medium">Invite Friends</div>
    <Button size="sm" onClick={() => setShowInvite(true)}>
      Invite Now
    </Button>
  </CardContent>
</Card>


        <Button variant="outline" className="w-full">
          Sign Out
        </Button>
      </div>
      {showConnectModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white dark:bg-background p-6 rounded-lg w-[90%] max-w-sm space-y-4 shadow-lg">
      <h3 className="text-lg font-semibold text-center">Find & Connect</h3>
      <p className="text-sm text-muted-foreground text-center">Enter mobile number to connect.</p>

      <Input
        placeholder="Enter mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        disabled={otpSent}
      />

      {otpSent && (
        <Input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      )}

      <div className="space-y-2">
        {!otpSent ? (
          <Button
            className="w-full"
            onClick={() => {
              // Simulate sending OTP
              setOtpSent(true);
              setConnectStatus("OTP sent to " + mobile);
            }}
            disabled={!mobile}
          >
            Send OTP
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              // Simulate OTP verification
              if (otp === "1234") {
                setConnectStatus("Friend connected successfully!");
                setTimeout(() => setShowConnectModal(false), 2000);
              } else {
                setConnectStatus("Invalid OTP. Try again.");
              }
            }}
            disabled={!otp}
          >
            Verify & Connect
          </Button>
        )}
        <Button variant="outline" className="w-full" onClick={() => setShowConnectModal(false)}>
          Cancel
        </Button>
        {connectStatus && <p className="text-center text-xs text-muted-foreground">{connectStatus}</p>}
      </div>
    </div>
  </div>
)}
{showProModal && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-background p-6 rounded-lg w-[90%] max-w-sm space-y-4 shadow-lg">
      <h2 className="text-lg font-semibold text-center">Choose Payment Method</h2>
      <p className="text-sm text-muted-foreground text-center">
        This is a demo. In real app, you'd proceed to secure payment via Razorpay, UPI, etc.
      </p>
      <div className="flex flex-col space-y-2">
        <Button variant="outline" onClick={() => {
          setProMessage("Payment successful! You’ve unlocked Pro 🎉");
          setShowProModal(false);
        }}>Pay with UPI</Button>
        <Button variant="outline" onClick={() => {
          setProMessage("Payment successful! You’ve unlocked Pro 🎉");
          setShowProModal(false);
        }}>Pay with Card</Button>
      </div>
      <Button variant="secondary" onClick={() => setShowProModal(false)}>
        Cancel
      </Button>
    </div>
  </div>
)}

{proMessage && (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
    {proMessage}
  </div>
)}




    </MobileLayout>
  )
}
