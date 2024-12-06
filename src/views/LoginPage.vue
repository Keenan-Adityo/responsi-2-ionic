<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div id="container">
                <!-- Title -->
                <ion-text style="margin-bottom: 20px; text-align: center;">
                    <h1>Pahlawan Kekaisaran</h1>
                </ion-text>
            
                    <ion-list>
                        <ion-item>
                            <ion-input label="Email"></ion-input>
                        </ion-item>

                        <ion-item>
                            <ion-input label="Password"></ion-input>
                        </ion-item>
                    </ion-list>

                <ion-button @click="login" color="dark">
                    <ion-label>Login</ion-label>
                </ion-button>
                <ion-text style="margin-bottom: 20px; text-align: center;">
                    <p>Tidak punya akun? <a href="/register">Register</a></p>
                </ion-text> 
                <!-- Button Sign In -->
                <ion-button @click="login" color="light">
                    <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
                    <ion-label>Sign In with Google</ion-label>
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonButton, IonIcon, IonText, IonLabel } from '@ionic/vue';
import { logoGoogle } from 'ionicons/icons';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const login = async () => {
    await authStore.loginWithGoogle();
};
</script>

<style>
#container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

ion-button {
    --border-radius: 8px;
}
</style>