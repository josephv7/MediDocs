package org.blockchain.medical.finalandroid;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

public class Splash extends AppCompatActivity {

    SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        sharedPreferences = getApplicationContext().getSharedPreferences("MyPref", MODE_PRIVATE);

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {

                if(sharedPreferences.getBoolean("loggedin",false)){
                    Intent homeIntent = new Intent(Splash.this,Home.class);
                    startActivity(homeIntent);
                    finish();
                }else{
                    Intent loginIntent = new Intent(Splash.this,Login.class);
                    startActivity(loginIntent);
                    finish();
                }



            }
        },3000);

    }


}
