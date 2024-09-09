<template>
  <div class="app-container">
    <h1>Juego de Niveles</h1>
    <div class="levels">
      <LevelComponent v-for="level in visibleLevels" :key="level.id" :level="level"
        @level-completed="handleLevelCompleted" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LevelComponent from './components/LevelComponent.vue';

export default {
  components: {
    LevelComponent
  },
  data() {
    return {
      levels: []
    };
  },
  async created() {
    // Al iniciar la aplicación, cargamos los niveles y el progreso guardado.
    try {
      axios.get('https://ciendias-api.onrender.com/api/levels', {
        withCredentials: true  // Asegura que las cookies de sesión se envíen
      })
        .then(response => {
          this.levels = response.data;
          console.log(response.data); 
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
      

      // Cargar progreso guardado desde localStorage
      this.loadSavedProgress();
    } catch (error) {
      console.error("Error al obtener los niveles", error);
    }
  },
  computed: {
    visibleLevels() {
      return this.levels.filter((level, index) => {
        // Mostrar el primer nivel o niveles completados y su siguiente
        return index === 0 || this.levels[index - 1].completed;
      });
    }
  },
  methods: {
    // Actualiza el estado de nivel completado y guarda en localStorage
    handleLevelCompleted(levelNumber) {
      const level = this.levels.find(l => l.levelNumber === levelNumber);
      if (level) {
        level.completed = true;

        // Guardar el progreso en localStorage
        this.saveProgress();
      }
    },

    // Guardar el estado de los niveles completados en localStorage
    saveProgress() {
      const completedLevels = this.levels.map(level => ({
        levelNumber: level.levelNumber,
        completed: level.completed
      }));

      // Guardar el progreso en localStorage como una cadena JSON
      localStorage.setItem('levelProgress', JSON.stringify(completedLevels));
    },

    // Cargar el progreso desde localStorage al iniciar la app
    loadSavedProgress() {
      const savedProgress = localStorage.getItem('levelProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);

        // Actualizar el estado de los niveles en base al progreso guardado
        progress.forEach(savedLevel => {
          const level = this.levels.find(l => l.levelNumber === savedLevel.levelNumber);
          if (level) {
            level.completed = savedLevel.completed;
          }
        });
      }
    }
  }
};
</script>

<style>
body {
  background-image: url("./assets/background.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 42%;
}

.app-container {
  text-align: center;
  padding: 20px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  box-shadow: 10px 10px 40px black;
  color: white;
  font-family: 'Press Start 2P', cursive;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.levels {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  h1 {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.2rem;
  }
}
</style>
