<template>
  <div class="level-container">
    <h2>Level {{ level.levelNumber }}</h2>
    <input v-model="word" placeholder="Enter the word" />
    <button @click="validateLevel">Submit</button>
    <p v-if="message">{{ message }}</p>

    <!-- Botón para mostrar el input del easter egg -->
    <button v-if="showEasterEggInput && level.completed" @click="toggleEasterEggInput">
      {{ easterEggInputVisible ? "Hide Easter Egg Input" : "Show Easter Egg Input" }}
    </button>
    <div v-if="easterEggInputVisible && level.completed">
      <input v-model="easterEggWord" placeholder="Enter the easter egg word" />
      <button @click="validateEasterEgg">Submit Easter Egg</button>
      <p v-if="easterEggMessage">{{ easterEggMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['level'],
  data() {
    return {
      word: '',
      message: '',
      easterEggWord: '',
      easterEggMessage: '',
      easterEggInputVisible: false
    };
  },
  computed: {
    showEasterEggInput() {
      return this.level.completed;
    }
  },
  methods: {
    async validateLevel() {
      try {
        const response = await axios.post('https://ciendias-api.onrender.com/api/levels/validate', null, {
          params: {
            word: this.word,
            levelNumber: this.level.levelNumber
          }
        });

        if (response.status === 200) {
          this.message = response.data;
          console.log(this.message)
          // Emitir un evento al componente padre para marcar este nivel como completado
          this.$emit('level-completed', this.level.levelNumber);
        } else {
          this.message = response.data || 'Palabra incorrecta';
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.message = error.response.data || 'Palabra incorrecta';
        } else {
          console.error('Error en la validación del nivel', error);
          this.message = 'Error de red o en el servidor';
        }
      }
    },
    toggleEasterEggInput() {
      this.easterEggInputVisible = !this.easterEggInputVisible;
    },
    async validateEasterEgg() {
      try {
        console.log(this.level)
        const response = await axios.post('https://ciendias-api.onrender.com/api/easteregg/validate', null, {
          params: {
            word: this.easterEggWord,
            easterEggNumber: this.level.levelNumber
          }
        });

        if (response.status === 200) {
          this.easterEggMessage = response.data;
        } else {
          this.easterEggMessage = response.data || 'Palabra incorrecta';
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.easterEggMessage = error.response.data || 'Palabra incorrecta';
        } else {
          console.error('Error en la validación del easter egg', error);
          this.easterEggMessage = 'Error de red o en el servidor';
        }
      }
    }
  }
};
</script>

<style scoped>

/* Contenedor flexible para centrado y espaciado */
.level-container {
  background-color: #e8f5e9;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  margin: 20px auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Diseño responsive para fuentes y espaciado */
h2 {
  color: #4caf50;
  font-family: 'Press Start 2P', cursive;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

input, button {
  width: 80%;
  max-width: 300px;
  border: 1px solid #4caf50;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-family: 'Press Start 2P', cursive;
  font-size: 1rem;
}

button {
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

p {
  color: #4caf50;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.9rem;
  margin-top: 10px;
}

/* Media queries para dispositivos móviles */
@media (max-width: 768px) {
  h2 {
    font-size: 1rem;
  }

  input, button {
    font-size: 0.9rem;
    padding: 8px;
  }

  button {
    width: 100%;
    padding: 12px;
  }

  p {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .level-container {
    max-width: 90%;
    padding: 15px;
  }

  h2 {
    font-size: 0.9rem;
  }

  input, button {
    font-size: 0.8rem;
    padding: 6px;
  }
}
</style>
