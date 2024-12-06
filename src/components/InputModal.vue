<!-- src/components/InputModal.vue -->
<template>
    <ion-modal :is-open="isOpen" @did-dismiss="cancel">
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ editingId ? 'Edit' : 'Add' }} Pahlawan</ion-title>
                <ion-buttons slot="start">
                    <ion-button @click="cancel"><ion-icon :icon="close"></ion-icon></ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-item>
                <ion-input v-model="pahlawan.name" label="Nama Pahlawan" label-placement="floating"
                    placeholder="Masukan Nama"></ion-input>
            </ion-item>
            <ion-item>
                <ion-textarea v-model="pahlawan.story" label="Ceritanya" label-placement="floating"
                    placeholder="Masukan Cerita " :autogrow="true" :rows="3"></ion-textarea>
            </ion-item>
            <ion-row>
                <ion-col>
                    <ion-button type="button" @click="input" shape="round" color="primary" expand="block">
                        {{ editingId ? 'Edit' : 'Add' }} Pahlawan
                    </ion-button>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-modal>
</template>
<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonInput, IonRow, IonCol, IonItem, IonContent, IonTextarea } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { Pahlawan } from '@/utils/firestore';

const props = defineProps<{
    isOpen: boolean,
    editingId: string | null,
    pahlawan: Omit<Pahlawan, 'id' | 'createdAt' | 'updatedAt' | 'status'>
}>();

const emit = defineEmits<{
    'update:isOpen': [value: boolean],
    'update:editingId': [value: string | null],
    'submit': [item: Omit<Pahlawan, 'id' | 'createdAt' | 'updatedAt' | 'status'>]
}>();

const cancel = () => {
    emit('update:isOpen', false);
    emit('update:editingId', null);
    props.pahlawan.name = '';
    props.pahlawan.story = '';
}
const input = () => {
    emit('submit', props.pahlawan);
    cancel();
}
</script>