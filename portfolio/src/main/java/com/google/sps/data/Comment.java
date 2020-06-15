// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.data;

import com.google.appengine.api.datastore.Entity;

public final class Comment {
    private final String content;
    private final long timestamp;
    private final double sentimentScore; 
    private final double sentimentMagnitude; 

    public Comment(String content, long timestamp, double sentimentScore, double sentimentMagnitude) {
        this.content = content;
        this.timestamp = timestamp;
        this.sentimentScore = sentimentScore;
        this.sentimentMagnitude = sentimentMagnitude;
    }

    public static Comment fromEntity(Entity entity) {
        String content = (String) entity.getProperty("content");
        long timestamp = (long) entity.getProperty("timestamp");
        double sentimentScore = (double) entity.getProperty("sentimentScore");
        double sentimentMagnitude = (double) entity.getProperty("sentimentMagnitude");

        Comment comment = new Comment(content, timestamp, sentimentScore, sentimentMagnitude);

        return comment;
    }
}