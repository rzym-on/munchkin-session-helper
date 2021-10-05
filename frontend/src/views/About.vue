<template>
  <q-layout>
    <q-page-container>
      <q-page class="window-height window-width">
        <div class="row window-height items-center justify-center">
          <div class="col-12 col-md-6">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h3 center">Hello fellow in GrandMajster</div>
              </q-card-section>

              <q-card-section class="center">
                I'll help you to start your game session, but first let me know, who you are.
              </q-card-section>

              <q-separator inset />

              <q-card-section>
                <div class="row justify-center">
                  <div class="col-12 col-md-10">
                    <div class="row">
                      <div class="column items-end">
                        <div class="col-12 col-md-3">
                          <q-btn
                            color="secondary"
                            label="I'm a game master"
                            class="choose-button"
                            to="/manage"
                          />
                        </div>
                      </div>
                      <div class="column justify-center">
                        <div class="col-12 col-md-7">
                          <p>Choose if you want to manage the game session,
                        create players and update their info</p>
                        </div>
                      </div>
                    </div>

                    <br>

                    <div class="row">
                      <div class="column items-end">
                        <div class="col-12 col-md-3">
                          <q-btn
                            color="secondary"
                            label="I'm here to watch"
                            class="choose-button"
                            to="/watch"
                          />
                        </div>
                      </div>
                      <div class="column justify-center">
                        <div class="col-12 col-md-7">
                          <p>
                            Choose if you want to watch game session
                            that was already created.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style lang="scss" scoped>
.center {
  text-align: center;
}
.choose-button {
  margin-right: 0.5rem;
}
</style>
