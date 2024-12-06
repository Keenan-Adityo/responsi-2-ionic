<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Laporkan Kesalahan</ion-title>
                <ion-button slot="end" fill="clear" @click="logout" style="--color: gray;">
                    <ion-icon slot="end" :icon="exit"></ion-icon>
                    <ion-label>Logout</ion-label>
                </ion-button>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
                <div class="centered-text">
                    <h2>Sad Keenanda Adityo</h2>
                    <p>H1D021045</p>
                    <p>Shift C -> Shift F</p>
                    <p>+6281216010576</p>
                </div>
            </ion-content>

        

    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonList, IonLabel, IonIcon, IonButton, IonAvatar } from '@ionic/vue';
import { exit } from 'ionicons/icons';
import { computed, ref } from 'vue';
import TabsMenu from '@/components/TabsMenu.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const logout = () => {
    authStore.logout();
};

const userPhoto = ref(user.value?.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg');

function handleImageError() {
    userPhoto.value = 'https://ionicframework.com/docs/img/demos/avatar.svg';
}
</script>

<style scoped>
#avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
}

#avatar-icon {
    width: 80px;
    height: 80px;
}

.centered-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; 
  text-align: center;
}

</style>