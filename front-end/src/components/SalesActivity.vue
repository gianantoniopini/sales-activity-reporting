<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-auto bg-light sticky-top">
        <!-- sidebar -->
        <div
          class="d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top"
          role="navigation"
        >
          <ul
            class="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center justify-content-between w-100 px-3 align-items-center"
          ></ul>
        </div>
      </div>
      <div class="col-sm p-3 min-vh-100">
        <!-- content -->
        <div>
          <div class="row">
            <div class="col-12">
              <form @submit.prevent="onSubmit" class="row form">
                <label
                  for="selectedMap"
                  class="col-sm-3 col-md-2 col-lg-1 col-form-label"
                  >Auswahl:</label
                >
                <div class="col-sm-5 col-md-4 col-lg-3">
                  <select
                    id="selectedMap"
                    class="form-select"
                    @change="handleSelectChange($event)"
                  >
                    <option value="" selected disabled>Wählen</option>
                    <option
                      v-for="mapKey in mapKeys"
                      :value="mapKey"
                      :key="mapKey"
                    >
                      {{ mapKey }}
                    </option>
                  </select>
                </div>
              </form>
            </div>
          </div>
          <div class="row">
            <div class="col-12"><hr /></div>
          </div>
          <div class="row">
            <div class="col-sm-8 col-md-6 col-lg-4">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col" class="text-center">Was</th>
                    <th scope="col" class="text-end">Wie viel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="([key, value], index) in selectedMapEntries"
                    :key="index"
                  >
                    <td class="text-start">
                      {{ key }}
                    </td>
                    <td class="text-end">
                      {{ value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createToast } from 'mosha-vue-toastify';
import DataService from '../services/DataService';
import SalesActivity from '../types/SalesActivity';

export default defineComponent({
  name: 'SalesActivity',

  data() {
    return {
      loading: false,
      map: new Map<string, Map<string, number>>(),
      mapKeys: [] as string[],
      selectedMapEntries: null as unknown as IterableIterator<[string, number]>
    };
  },

  methods: {
    async loadData() {
      this.loading = true;
      const { close: closeToast } = createToast('Loading data...', {
        position: 'top-center',
        showCloseButton: false,
        timeout: -1,
        transition: 'slide',
        type: 'info'
      });

      try {
        const salesActivities = await DataService.getSalesActivity();
        this.buildMap(salesActivities);
      } catch (error) {
        console.log(error);
      } finally {
        closeToast();
        this.loading = false;
      }
    },

    buildMap(salesActivities: SalesActivity[]) {
      for (const salesActivity of salesActivities) {
        const key = salesActivity.firstName;
        const value = new Map<string, number>([
          ['Leads', salesActivity.leads],
          ['Neue Leads', salesActivity.newLeads],
          ['Anrufe', salesActivity.calls],
          ['Leads angerufen', salesActivity.leadsCalled],
          ['Leads erreicht', salesActivity.leadsReached]
        ]);

        this.map.set(key, value);
      }

      this.map.set(
        'Total',
        new Map<string, number>([
          [
            'Leads',
            salesActivities.reduce((sum, current) => sum + current.leads, 0)
          ],
          [
            'Neue Leads',
            salesActivities.reduce((sum, current) => sum + current.newLeads, 0)
          ],
          [
            'Anrufe',
            salesActivities.reduce((sum, current) => sum + current.calls, 0)
          ],
          [
            'Leads angerufen',
            salesActivities.reduce(
              (sum, current) => sum + current.leadsCalled,
              0
            )
          ],
          [
            'Leads erreicht',
            salesActivities.reduce(
              (sum, current) => sum + current.leadsReached,
              0
            )
          ]
        ])
      );

      this.mapKeys = [...this.map.keys()];
    },

    handleSelectChange(event: Event) {
      const target = event.target as HTMLInputElement;

      const selectedMap = this.map.get(target.value) as Map<string, number>;
      this.selectedMapEntries = selectedMap.entries();
    }
  },

  async mounted() {
    await this.loadData();
  }
});
</script>
