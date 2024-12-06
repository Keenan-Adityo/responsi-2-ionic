<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>List Pahlawan Kekaisaran</ion-title>
      </ion-toolbar>
    </ion-header>


<ion-content :fullscreen="true">
	<ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
    @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

<div class="scrollable-container">
  <ion-list>
    <ion-item-sliding v-for="pahlawan in listPahlawan" :key="pahlawan.id" :ref="(el) => setItemRef(el, pahlawan.id!)">
      <ion-item-options side="start" @ionSwipe="handleDelete(pahlawan)">
        <ion-item-option color="danger" expandable @click="handleDelete(pahlawan)">
          <ion-icon slot="icon-only" :icon="trash" size="large"></ion-icon>
        </ion-item-option>
      </ion-item-options>

      <ion-item>
        <ion-card>
          <ion-card-header>
            <ion-card-title class="ion-text-wrap limited-text">{{ pahlawan.name }}</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-card-subtitle class="limited-text">{{ pahlawan.story }}</ion-card-subtitle>
            <ion-badge color="success">{{ getRelativeTime(pahlawan.updatedAt) }}</ion-badge>
          </ion-card-content>
        </ion-card>
      </ion-item>
      <ion-item-options side="end" @ionSwipe="handleEdit(pahlawan)">
        <ion-item-option @click="handleEdit(pahlawan)">
          <ion-icon slot="icon-only" :icon="create" size="large"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
    <ion-item v-if="listPahlawan.length === 0" class="ion-text-center">
      <ion-label>list Pahlawan masih kosong</ion-label>
    </ion-item>
  </ion-list>
</div>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed" co>
    <ion-fab-button @click="isOpen = true;">
      <ion-icon :icon="add" size="large"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <InputModal v-model:isOpen="isOpen" v-model:editingId="editingId" :pahlawan="pahlawan" @submit="handleSubmit" />
</ion-content>

  </ion-page>
</template>


<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonAccordion,
  IonAccordionGroup,
  IonLabel,
  IonList,
  loadingController,
  IonRefresher,
  IonRefresherContent,
  toastController
} from '@ionic/vue';
import {
  add,
  checkmarkCircle,
  close,
  create,
  trash,
  closeCircle,
  warningOutline
} from 'ionicons/icons';
import InputModal from '@/components/InputModal.vue';
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { firestoreService, type Pahlawan } from '@/utils/firestore';
import { formatDistanceToNow } from 'date-fns';

const isOpen = ref(false);
const editingId = ref<string | null>(null);
const pahlawanRef = ref<Pahlawan[]>([]);
const pahlawan = ref<Omit<Pahlawan, 'id' | 'createdAt' | 'updatedAt'>>({
  name: '',
  story: '',
});
const listPahlawan = computed(() => pahlawanRef.value);
const itemRefs = ref<Map<string, HTMLIonItemSlidingElement>>(new Map());
let intervalId: any;
const timeUpdateTrigger = ref(0);

const setItemRef = (el: any, id: string) => {
  if (el) {
    itemRefs.value.set(id, el.$el);
  }
};

const showToast = async (message: string, color: string = 'success', icon: string = checkmarkCircle) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'top',
    icon
  });
  await toast.present();
};

const getRelativeTime = (date: any) => {
  timeUpdateTrigger.value;
  try {
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(jsDate, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

const handleRefresh = async (event: any) => {
  try {
    await loadPahlawan(false);
  } catch (error) {
    console.error('Error refreshing:', error);
  } finally {
    event.target.complete();
  }
};

const handleSubmit = async (pahlawan: Omit<Pahlawan, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (!pahlawan.name) {
    await showToast('Title is required', 'warning', warningOutline);
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updatePahlawan(editingId.value, pahlawan as Pahlawan);
      await showToast('Pahlawan updated successfully', 'success', checkmarkCircle);
    } else {
      await firestoreService.addPahlawan(pahlawan as Pahlawan);
      await showToast('Pahlawan added successfully', 'success', checkmarkCircle);
    }
    loadPahlawan();
  } catch (error) {
    await showToast('An error occurred', 'danger', closeCircle);
    console.error(error);
  } finally {
    editingId.value = null;
  }
};

const handleEdit = async (editPahlawan: Pahlawan) => {
  const slidingItem = itemRefs.value.get(editPahlawan.id!);
  await slidingItem?.close();

  editingId.value = editPahlawan.id!;
  pahlawan.value = {
    name: editPahlawan.name,
    story: editPahlawan.story,
  }
  isOpen.value = true;
}

const handleDelete = async (deletePahlawan: Pahlawan) => {
  try {
    await firestoreService.deletePahlawan(deletePahlawan.id!);
    await showToast('Pahlawan deleted successfully', 'success', checkmarkCircle);
    loadPahlawan();
  } catch (error) {
    await showToast('Failed to delete Pahlawan', 'danger', closeCircle);
    console.error(error);
  }
};

const loadPahlawan = async (isLoading = true) => {
  let loading;
  if (isLoading) {
    loading = await loadingController.create({
      message: 'Loading...'
    });
    await loading.present();
  }

  try {
    pahlawanRef.value = await firestoreService.getPahlawan();
  } catch (error) {
    console.error(error);
  } finally {
    if (loading) {
      await loading.dismiss();
    }
  }
};

onMounted(() => {
  loadPahlawan();
  intervalId = setInterval(() => {
    timeUpdateTrigger.value++;
  }, 60000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

</script>

<style scoped>
ion-card,
ion-accordion-group {
  width: 100%;
}

ion-fab {
  margin: 25px;
}

.limited-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

ion-card-title.limited-text {
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

ion-card-subtitle.limited-text {
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.scrollable-container {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.accordion-container {
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

.scrollable-container::-webkit-scrollbar {
  width: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>