package com.example.mobilesocketdemo;

import java.net.URI;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        sendData(); // This is the function you want to call to send your data to the browser client.
        			// Be sure to update the function with your URL. 
        			// You will also likely want to move this function call to somewhere else in your code once your app is more completely built. 
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.activity_main, menu);
        return true;
    }
    
    private void sendData() {
		new Thread(new Runnable() { 
			@Override
			public void run() {
				try{
					HttpClient httpClient = new DefaultHttpClient();
		            HttpGet httpGet = new HttpGet();
		            //Update the URL below with your specific content!
		            URI uri = new URI("http://myurl.com:1101/add/?id="+10+"&name=Mike"); //for exmaple...
		            httpGet.setURI(uri);
		            httpClient.execute(httpGet);
//			            System.out.println("HTTP Worked");
				} catch (Exception e) {
					System.out.println("HTTP Didn't Work");
					System.out.println(e);
				}
			}
		}).start();
	}
}
