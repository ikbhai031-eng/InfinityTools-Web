
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  useAuth, 
  useUser, 
  useFirestore 
} from '@/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ShieldCheck, 
  Chrome, 
  ArrowRight, 
  Lock, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function LoginPage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    if (!auth || !db) return;

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Synchronize profile to Firestore immediately
      // This ensures the backend has a record of the user for security rules validation
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(), // merge: true handles existing docs
      }, { merge: true }).catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: { uid: user.uid },
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      toast({
        title: "Authenticated Successfully",
        description: `Welcome back, ${user.displayName}!`,
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Could not sign in with Google.",
      });
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full -z-10 opacity-30 animate-pulse delay-700"></div>

        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary uppercase tracking-widest border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Security Active
            </div>
            <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-tight">
              One Secure Identity. <br/>
              <span className="text-primary">Infinite Possibilities.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Join the elite workspace where performance meets privacy. Sign in to access your AI history, saved resumes, and professional tool configurations.
            </p>
            
            <div className="space-y-4">
              {[
                "Hardware-grade encryption",
                "GDPR & CCPA compliant data handling",
                "Zero-trust processing architecture"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> {text}
                </div>
              ))}
            </div>
          </div>

          <Card className="glass rounded-[3rem] border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
            <CardHeader className="p-12 pb-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Secure Access</CardTitle>
              <CardDescription className="text-lg">
                Verified OAuth 2.0 Identity Protocol
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12 pt-0 space-y-8">
              <Button 
                onClick={handleGoogleLogin}
                className="w-full h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20 bg-white text-black hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Chrome className="w-6 h-6" /> Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-muted-foreground">
                  <span className="bg-[#0c0c0e] px-4">Protected by InfinityShield</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 glass rounded-2xl text-center space-y-2 border-white/5">
                  <Zap className="w-5 h-5 text-amber-500 mx-auto" />
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Latency</div>
                  <div className="text-sm font-bold">24ms</div>
                </div>
                <div className="p-4 glass rounded-2xl text-center space-y-2 border-white/5">
                  <ShieldCheck className="w-5 h-5 text-green-500 mx-auto" />
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Encryption</div>
                  <div className="text-sm font-bold">AES-256</div>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground leading-relaxed">
                By signing in, you agree to our <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
