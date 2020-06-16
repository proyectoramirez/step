// Copyright 2020 Google LLC
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

package com.google.sps.servlets;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import com.google.gson.Gson;
import com.google.sps.data.Comment;

@WebServlet("/data")
public class DataServlet extends HttpServlet {
  private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);

    ArrayList<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      Comment comment = Comment.fromEntity(entity);
      comments.add(comment);
    }

    Gson gson = new Gson();
    String json = gson.toJson(comments);

    response.setContentType("application/json");
    response.getWriter().print(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String commentText = request.getParameter("comment");
    Entity commentEntity = createCommentEntity(commentText);

    datastore.put(commentEntity);

    response.sendRedirect("/");
  }

  private Entity createCommentEntity(String commentText) throws IOException {
    Entity commentEntity = new Entity("Comment");
    long timestamp = System.currentTimeMillis();
    Sentiment sentiment = getCommentSentiment(commentText);

    commentEntity.setProperty("content", commentText);
    commentEntity.setProperty("timestamp", timestamp);
    commentEntity.setProperty("sentimentScore", sentiment.getScore());
    commentEntity.setProperty("sentimentMagnitude", sentiment.getMagnitude());

    return commentEntity;
  }

  private Sentiment getCommentSentiment(String commentText) throws IOException {
    Document doc = Document.newBuilder().setContent(commentText).setType(Document.Type.PLAIN_TEXT).build();
    
    LanguageServiceClient languageService = LanguageServiceClient.create();
    Sentiment sentiment = languageService.analyzeSentiment(doc).getDocumentSentiment();
    languageService.close();

    return sentiment;
  }
}
